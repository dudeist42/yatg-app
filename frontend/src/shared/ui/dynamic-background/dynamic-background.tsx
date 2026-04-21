import React from 'react';
import classes from './dynamic-background.module.css';
import { useImagePreload } from './use-image-preload';
import { usePalette } from './use-palette';
import { generateGradient } from './generate-gradient';

export type TDynamicBackgroundProps = {
  src: string | null | undefined;
  enabled?: boolean;
  darken?: boolean;
};

export const DynamicBackground: React.FC<TDynamicBackgroundProps> = ({
  src,
  enabled = true,
  darken = true,
}) => {
  const { img, isLoaded } = useImagePreload(src);
  const palette = usePalette(img);

  if (!enabled) return null;

  return (
    <div className={classes.container}>
      <div
        className={classes.backdrop}
        style={{
          backgroundImage: src ? `url(${src})` : 'none',
          opacity: isLoaded ? '0.5' : '0',
        }}
      />
      <div
        className={classes.gradientLayer}
        style={{ background: generateGradient(palette) }}
      />
      {darken && <div className={classes.darkenLayer} />}
    </div>
  );
};
