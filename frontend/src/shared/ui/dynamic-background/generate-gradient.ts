import { RGB } from './types';

export const rgba = ({ r, g, b }: RGB, a: number = 1) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

export const generateAccentColor = (color: RGB, a: number = 1) => {
  const accent = {
    r: Math.round(color.r * a),
    g: Math.round(color.g * a),
    b: Math.round(color.b * a),
  };

  return rgba(accent);
};

export const generateGradient = ({ vibrant, dark }: Palette): string => {
  const accent = {
    r: Math.round(vibrant.r * 0.6),
    g: Math.round(vibrant.g * 0.6),
    b: Math.round(vibrant.b * 0.6),
  };

  return `linear-gradient(
    135deg,
    ${generateAccentColor(accent, 0.85)} 0%,
    ${generateAccentColor(accent, 0.6)} 40%,
    ${generateAccentColor(dark, 0.95)} 75%,
    ${generateAccentColor(dark, 0.7)} 100%
  )`;
};
