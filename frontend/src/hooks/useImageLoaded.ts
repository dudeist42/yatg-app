import { RefObject, useEffect, useEffectEvent, useState } from 'react';

export const useImageLoaded = (
  imgRef: RefObject<HTMLImageElement | null>,
  enabled = true,
) => {
  const [loaded, setLoaded] = useState(false);

  const loadImage = useEffectEvent(() => {
    setLoaded(true);
  });

  useEffect(() => {
    const img = imgRef.current;
    if (!enabled || !img) return;

    if (img.complete) {
      loadImage();
      return;
    }

    img.addEventListener('load', loadImage);

    return () => img.removeEventListener('load', loadImage);
  }, [enabled, imgRef]);

  return loaded;
};
