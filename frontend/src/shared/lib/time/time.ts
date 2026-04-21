export const minutesToDuration = (minutes: number) => {
  const hh = String(Math.floor(minutes / 60)).padStart(2, '0');
  const mm = String(minutes % 60).padStart(2, '0');

  return `${hh}:${mm}`;
};
