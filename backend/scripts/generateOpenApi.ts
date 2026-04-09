import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from '../src/app.module';
import { openApiConfig } from '../configs/openApi';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';

async function generate() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      enableDebugMessages: true,
      transform: true,
    }),
  );

  const document = SwaggerModule.createDocument(app, openApiConfig);
  fs.mkdirSync('./openapi', { recursive: true });
  fs.writeFileSync('./openapi/openapi.json', JSON.stringify(document, null, 2));

  await app.close();
}

generate().catch(() => {
  console.error('Unable to generate OpenApi docs.');
});
