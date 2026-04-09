import { DocumentBuilder } from '@nestjs/swagger';

export const openApiConfig = new DocumentBuilder()
  .setTitle('Yet another TIMDB application')
  .setDescription('Api')
  .setVersion('1.0')
  .addCookieAuth('refresh-token', {
    type: 'apiKey',
    in: 'cookie',
    name: 'refresh_token',
  })
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'access_token',
      in: 'header',
    },
    'access-token',
  )
  .build();
