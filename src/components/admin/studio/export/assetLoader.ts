// Preload an image safely with anonymous crossOrigin
export function preloadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // If CORS or loading fails, try proxy if Google Drive
      if (src.includes('lh3.googleusercontent.com/d/')) {
        const match = src.match(/lh3\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/);
        if (match) {
          const fallbackImg = new Image();
          fallbackImg.crossOrigin = 'anonymous';
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => resolve(null);
          fallbackImg.src = `/api/gdrive-image?id=${match[1]}`;
          return;
        }
      }
      resolve(null);
    };
    img.src = src;
  });
}

// Convert SVG markup to loaded HTMLImageElement for canvas rendering
export function svgToImage(svgString: string, width: number, height: number): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const fullSvg = svgString.includes('xmlns=')
      ? svgString
      : svgString.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    const blob = new Blob([fullSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.width = width;
    img.height = height;
    img.src = url;
  });
}
