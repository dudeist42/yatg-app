import { Inject, Injectable, Logger } from '@nestjs/common';
import { passwordPwnedValidationConfig } from './password-pwned.config';
import { type ConfigType } from '@nestjs/config';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import * as crypto from 'crypto';

@Injectable()
export class PasswordPwnedValidationService {
  private logger = new Logger(PasswordPwnedValidationService.name);

  constructor(
    @Inject(passwordPwnedValidationConfig.KEY)
    private readonly config: ConfigType<typeof passwordPwnedValidationConfig>,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  async validate(password: string): Promise<boolean> {
    if (!this.config.isValidationEnabled) {
      return true;
    }

    if (await this.hasCachedPwnedPassword(password)) {
      return false;
    }

    const hash = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();
    const prefix = hash.substring(0, 5);
    const suffix = hash.substring(5);

    try {
      let suffixes = await this.getCachedSuffixes(prefix);
      if (!suffixes) {
        suffixes = await this.fetchSuffixes(prefix);
        await this.setCachedSuffixes(prefix, suffixes);
      }

      const isPwned = suffixes.has(suffix);

      if (isPwned) {
        await this.setCachedPwnedPassword(password);
      }

      return !isPwned;
    } catch {
      return true;
    }
  }

  private async hasCachedPwnedPassword(password: string) {
    return !!(await this.cache.get(`pwned:${password}`));
  }

  private async setCachedPwnedPassword(password: string) {
    await this.cache.set(`pwned:${password}`, true);
  }

  private async setCachedSuffixes(prefix: string, suffixes: Set<string>) {
    await this.cache.set(`hibp:${prefix}`, Array.from(suffixes));
  }

  private async getCachedSuffixes(prefix: string) {
    const suffixes = await this.cache.get<string[]>(`hibp:${prefix}`);

    if (suffixes) {
      return new Set(suffixes);
    }

    return null;
  }

  private async fetchSuffixes(prefix: string): Promise<Set<string>> {
    const url = `${this.config.hibpUrl}/range/${prefix}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);

    try {
      const response = await fetch(url, { signal: controller.signal });
      const text = await response.text();
      return new Set(text.split('\n').map((line) => line.split(':')[0]));
    } catch (error) {
      this.logger.error(`Request HIBP failed`, error);
      throw new Error('Unable to verify password security');
    } finally {
      clearTimeout(timeout);
    }
  }
}
