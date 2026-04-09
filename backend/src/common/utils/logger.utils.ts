import { LogLevel } from '@nestjs/common';

const LOG_LEVELS: LogLevel[] = [
  'verbose',
  'debug',
  'log',
  'warn',
  'error',
  'fatal',
];

export function getLogLevels(level: string): LogLevel[] {
  const index = LOG_LEVELS.indexOf(level as LogLevel);

  if (index !== -1) {
    return LOG_LEVELS.slice(index);
  }

  return ['log', 'error', 'warn', 'fatal'];
}
