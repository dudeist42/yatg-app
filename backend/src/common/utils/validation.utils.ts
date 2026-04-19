import { ValidationError } from 'class-validator';

export const formatErrors = (
  errors: ValidationError[],
  parentPath = '',
): Record<string, string[]> => {
  const result: Record<string, string[]> = {};

  errors.forEach((error) => {
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      result[propertyPath] = Object.values(error.constraints);
    }

    if (error.children && error.children.length > 0) {
      const childErrors = formatErrors(error.children, propertyPath);
      Object.assign(result, childErrors);
    }
  });

  return result;
};
