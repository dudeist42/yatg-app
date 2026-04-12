export const getOffsetByPage = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

export const getTotalPages = (totalItems: number, limit: number): number => {
  return Math.ceil(totalItems / limit);
};
