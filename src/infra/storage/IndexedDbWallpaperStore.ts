import { type BraveWallpaper } from '../../core/models/Wallpaper';
import { type ICustomWallpaperStore } from '../../core/ports/ICustomWallpaperStore';

const DB_NAME = 'weatherybrave_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_wallpapers';

interface StoredWallpaperRecord {
  readonly id: string;
  readonly dataUrl: string;
  readonly author: string;
  readonly createdAt: number;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read image file'));
      }
    };
    reader.onerror = () => reject(new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}

export class IndexedDbWallpaperStore implements ICustomWallpaperStore {
  private dbPromise: Promise<IDBDatabase> | null = null;

  public async loadCustomWallpapers(): Promise<readonly BraveWallpaper[]> {
    try {
      const db = await this.openDb();
      return await new Promise<readonly BraveWallpaper[]>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => {
          const rows = (req.result as StoredWallpaperRecord[]) ?? [];
          rows.sort((a, b) => a.createdAt - b.createdAt);
          resolve(
            rows.map((r) => ({
              id: r.id,
              filename: r.dataUrl,
              author: r.author,
              creditUrl: '#',
              isCustom: true,
            }))
          );
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  }

  public async addCustomWallpaper(
    file: File,
    author?: string
  ): Promise<BraveWallpaper> {
    const dataUrl = await readFileAsDataUrl(file);
    const cleanName = file.name.replace(/\.[^.]+$/, '').slice(0, 28);
    const label = (author?.trim() || cleanName || 'Custom Wallpaper').slice(
      0,
      32
    );
    const record: StoredWallpaperRecord = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      dataUrl,
      author: label,
      createdAt: Date.now(),
    };

    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    return {
      id: record.id,
      filename: record.dataUrl,
      author: record.author,
      creditUrl: '#',
      isCustom: true,
    };
  }

  public async removeCustomWallpaper(id: string): Promise<void> {
    const db = await this.openDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  private openDb(): Promise<IDBDatabase> {
    if (this.dbPromise) {
      return this.dbPromise;
    }
    this.dbPromise = new Promise((resolve, reject) => {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return this.dbPromise;
  }
}
