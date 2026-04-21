import { useEffect, useRef, useState } from 'react';

interface ImagePreloadResult {
  img: HTMLImageElement | null;
  isLoaded: boolean;
}

export const useImagePreload = (
  src: string | null | undefined,
): ImagePreloadResult => {
  const [result, setResult] = useState<ImagePreloadResult>({
    img: null,
    isLoaded: false,
  });
  const prevSrcRef = useRef<string | null | undefined>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!src) {
      prevSrcRef.current = null;
      return;
    }
    prevSrcRef.current = src;

    const image = new Image();
    image.crossOrigin = 'anonymous';

    const onLoad = () => {
      if (isMountedRef.current) setResult({ img: image, isLoaded: true });
    };
    const onError = () => {
      if (isMountedRef.current) setResult({ img: null, isLoaded: false });
    };

    image.addEventListener('load', onLoad);
    image.addEventListener('error', onError);
    image.src = src;

    if (image.complete) onLoad();

    return () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };
  }, [src]);

  if (!src) return { img: null, isLoaded: false };
  return result;
};
