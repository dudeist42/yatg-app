import * as dbSchema from './schema';
import * as relations from './relations';

export const schema = {
  ...dbSchema,
  ...relations,
};
