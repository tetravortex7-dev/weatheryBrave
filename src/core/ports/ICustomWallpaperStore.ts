import { type BraveWallpaper } from '../models/Wallpaper';

export interface ICustomWallpaperStore {
  loadCustomWallpapers(): Promise<readonly BraveWallpaper[]>;
  addCustomWallpaper(file: File, author?: string): Promise<BraveWallpaper>;
  removeCustomWallpaper(id: string): Promise<void>;
}
