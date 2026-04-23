import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { HealthModule } from './modules/health/health.module';
import {
  ConsoleLogger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getLogLevels } from './common/utils/logger.utils';
import { useContainer } from 'class-validator';
import { openApiConfig } from '../configs/openApi';
import { camelCaseToWords } from './common/utils/string.utils';
import { formatErrors } from './common/utils/validation.utils';

const useSwaggerModule = (app: NestFastifyApplication) => {
  const documentFactory = () =>
    SwaggerModule.createDocument(app, openApiConfig, {
      operationIdFactory: (_, methodKey) => camelCaseToWords(methodKey),
    });
  SwaggerModule.setup('api', app, documentFactory);
};

async function createMainApp() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      logger: new ConsoleLogger({
        json: process.env.NODE_ENV === 'production',
        logLevels: getLogLevels(process.env.LOG_LEVEL ?? ''),
      }),
    },
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = formatErrors(errors);

        return new UnprocessableEntityException({
          status: 422,
          message: 'Validation error',
          errors: formattedErrors,
        });
      },
    }),
  );

  if (process.env.NODE_ENV === 'development') {
    useSwaggerModule(app);
  }

  return app;
}

async function createHealthApp() {
  return NestFactory.create<NestFastifyApplication>(
    HealthModule,
    new FastifyAdapter(),
  );
}

async function bootstrap() {
  const [app, healthApp] = await Promise.all([
    createMainApp(),
    createHealthApp(),
  ]);

  await Promise.all([
    app.listen(process.env.PORT ?? 3000, '::'),
    healthApp.listen(process.env.BACKEND_HEALTH_PORT ?? 3001, '::'),
  ]);
}

bootstrap().catch(() => {
  console.error('Unable to bootstrap application');
});
