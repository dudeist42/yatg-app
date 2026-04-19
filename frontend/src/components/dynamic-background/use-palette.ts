import { useEffect, useRef, useState } from 'react';
import { analyzeImageBitmap } from './palette-worker.singleton';
import { DEFAULT_PALETTE, type Palette } from './types';

export const usePalette = (img: HTMLImageElement | null): Palette => {
  const [palette, setPalette] = useState<Palette>(DEFAULT_PALETTE);
  const prevImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!img || prevImgRef.current === img) return;
    prevImgRef.current = img;

    let cancelled = false;

    createImageBitmap(img, {
      resizeWidth: 100,
      resizeHeight: 100,
      resizeQuality: 'high',
    })
      .then((bitmap) => {
        if (cancelled) {
          bitmap.close();
          return;
        }
        return analyzeImageBitmap(bitmap);
      })
      .then((newPalette) => {
        if (!cancelled && newPalette) setPalette(newPalette);
      })
      .catch(() => {
        if (!cancelled) setPalette(DEFAULT_PALETTE);
      });

    return () => {
      cancelled = true;
    };
  }, [img]);

  return palette;
};
