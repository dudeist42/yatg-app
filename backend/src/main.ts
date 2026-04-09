import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import { HealthModule } from './modules/health/health.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { getLogLevels } from './common/utils/logger.utils';
import { useContainer } from 'class-validator';
import fastifyCookie from '@fastify/cookie';
import { openApiConfig } from '../configs/openApi';

const useSwaggerModule = (app: NestFastifyApplication) => {
  const documentFactory = () =>
    SwaggerModule.createDocument(app, openApiConfig);
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
    }),
  );

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });

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
