import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI, 
    // defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableDebugMessages: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
    }),
  );

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  const port = process.env.PORT || 3030;
  await app.listen(port, () =>
  {
    console.log(`server started on port:${port}`)
  });
}
bootstrap();
