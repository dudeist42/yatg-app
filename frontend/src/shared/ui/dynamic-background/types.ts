export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Palette {
  dominant: RGB;
  vibrant: RGB;
  dark: RGB;
  muted: RGB;
  brightest: RGB;
}

export const DEFAULT_PALETTE: Palette = {
  dominant: { r: 20, g: 20, b: 30 },
  vibrant: { r: 60, g: 40, b: 80 },
  dark: { r: 10, g: 10, b: 15 },
  muted: { r: 35, g: 35, b: 45 },
  brightest: { r: 80, g: 70, b: 100 },
};
