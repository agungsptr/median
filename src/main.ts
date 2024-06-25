import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { config } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable shutdownhooks
  app.enableShutdownHooks();

  // Overide nest default logger in production mode
  if (config.NODE_ENV === 'production') {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  // Enable swagger
  const swaggerCfg = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API Description')
    .setVersion('0.1')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup(config.API_PREFIX, app, swaggerDoc);

  // Set validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(config.app.PORT).then(() => {
    Logger.log(
      `[NestApplication] App running on port: ${config.app.PORT} with version: ${config.app.VER}`,
    );
  });
}

bootstrap();
