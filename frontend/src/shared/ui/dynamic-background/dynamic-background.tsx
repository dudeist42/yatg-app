import React, { useEffect } from 'react';
import classes from './dynamic-background.module.css';
import { useImagePreload } from './use-image-preload';
import { usePalette } from './use-palette';
import { generateAccentColor, generateGradient } from './generate-gradient';
import clsx from 'clsx';

export type TDynamicBackgroundProps = {
  src: string | null | undefined;
  enabled?: boolean;
};

export const DynamicBackground: React.FC<TDynamicBackgroundProps> = ({
  src,
  enabled = true,
}) => {
  const { img, isLoaded } = useImagePreload(src);
  const palette = usePalette(img);

  useEffect(() => {
    if (enabled) {
      window.document.documentElement.style.background = `${generateGradient(palette)} ${generateAccentColor(palette.dark, 0.8)}`;
    }

    return () => {
      window.document.documentElement.style.background = 'none';
    };
  }, [enabled, palette, isLoaded]);

  if (!enabled) return null;

  return (
    <div className={classes.container}>
      <div
        className={clsx(classes.backdrop, 'max-sm:hidden')}
        style={{
          backgroundImage: src ? `url(${src})` : 'none',
          opacity: isLoaded ? '0.5' : '0',
        }}
      />
    </div>
  );
};
