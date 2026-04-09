import { registerAs } from '@nestjs/config';

const isValidationEnabled = (defaultIsEnabled = false) => {
  const value = process.env.PASSWORD_PWNED_VALIDATION_ENABLED;

  return value ? value === '1' || value === 'true' : defaultIsEnabled;
};

export const passwordPwnedValidationConfig = registerAs(
  'password-pwned-validation',
  () => ({
    cacheTtl: Number(process.env.PASSWORD_PWNED_VALIDATATION_CACHE_TTL) || 0,
    maxCacheRecords:
      Number(process.env.PASSWORD_PWNED_MAX_CACHE_RECORDS) || 1_000,
    hibpUrl:
      process.env.PASSWORD_PWNED_HIBP_URL || 'https://api.pwnedpasswords.com',
    isValidationEnabled: isValidationEnabled(),
  }),
);
