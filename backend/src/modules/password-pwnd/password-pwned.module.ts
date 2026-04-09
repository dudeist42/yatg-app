import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { passwordPwnedValidationConfig } from './password-pwned.config';
import { IsPasswordNotPwnedConstraint } from './constraints/password-pwned.constraint';
import { PasswordPwnedValidationService } from './password-pwned.service';

@Module({
  imports: [
    ConfigModule.forFeature(passwordPwnedValidationConfig),
    CacheModule.registerAsync({
      imports: [ConfigModule.forFeature(passwordPwnedValidationConfig)],
      inject: [passwordPwnedValidationConfig.KEY],
      useFactory: (
        config: ConfigType<typeof passwordPwnedValidationConfig>,
      ) => ({
        ttl: config.cacheTtl,
        max: config.maxCacheRecords,
      }),
    }),
  ],
  exports: [PasswordPwnedValidationService, IsPasswordNotPwnedConstraint],
  providers: [PasswordPwnedValidationService, IsPasswordNotPwnedConstraint],
})
export class PasswordPwndValidationModule {}
