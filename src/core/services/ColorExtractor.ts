export async function extractDominantColor(
  imageUrl: string
): Promise<string | null> {
  if (typeof document === 'undefined') {
    return null;
  }

  return new Promise((resolve) => {
    const img = new Image();
    if (/^https?:\/\//i.test(imageUrl)) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const size = 32;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, size, size);
        const data = ctx.getImageData(0, 0, size, size).data;

        let bestColor = null;
        let highestScore = -1;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i] ?? 0;
          const g = data[i + 1] ?? 0;
          const b = data[i + 2] ?? 0;
          const a = data[i + 3] ?? 0;
          if (a < 128) continue;

          const max = Math.max(r, g, b) / 255;
          const min = Math.min(r, g, b) / 255;
          const lum = (max + min) / 2;
          const delta = max - min;
          const sat = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1));

          if (lum > 0.22 && lum < 0.88 && sat > 0.22) {
            const score = sat * (1 - Math.abs(lum - 0.55));
            if (score > highestScore) {
              highestScore = score;
              bestColor = `rgb(${r}, ${g}, ${b})`;
            }
          }
        }

        resolve(bestColor);
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
}
