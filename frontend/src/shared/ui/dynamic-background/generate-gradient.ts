export const generateGradient = ({ vibrant, dark }: Palette): string => {
  const rgba = ({ r, g, b }: RGB, a: number) => `rgba(${r}, ${g}, ${b}, ${a})`;

  // Вибрантный цвет чуть приглушаем (60%), но не убиваем
  const accent = {
    r: Math.round(vibrant.r * 0.6),
    g: Math.round(vibrant.g * 0.6),
    b: Math.round(vibrant.b * 0.6),
  };

  return `linear-gradient(
    135deg,
    ${rgba(accent, 0.85)} 0%,
    ${rgba(accent, 0.6)} 40%,
    ${rgba(dark, 0.7)} 75%,
    ${rgba(dark, 0.95)} 100%
  )`;
};
