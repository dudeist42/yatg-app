const ASPECT_RATIO = 2 / 3;

export const PosterSize = {
  xs: 92,
  s: 154,
  m: 185,
  l: 342,
  xl: 500,
  xxl: 780,
} as const;

export const calcMoviePosterSize = ({
  width,
  height,
  size,
}: {
  width?: number;
  height?: number;
  size: keyof typeof PosterSize;
}) => {
  const computedWidth =
    width ?? (height ? height * ASPECT_RATIO : PosterSize[size] / 2);

  return {
    width: computedWidth,
    height: height ?? computedWidth / ASPECT_RATIO,
  };
};
