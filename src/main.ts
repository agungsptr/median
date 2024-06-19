import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { APP_PORT, APP_VER, NODE_ENV } from './constant/config.constant';
import { PathPrefix } from './constant/common.constant';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Enable shutdownhooks
  app.enableShutdownHooks();

  // Overide nest default logger in production mode
  if (config.get(NODE_ENV) === 'production') {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  // Enable swagger
  const swaggerCfg = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API Description')
    .setVersion('0.1')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup(PathPrefix, app, swaggerDoc);

  // Set validation pipe
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(config.get(APP_PORT)).then(() => {
    Logger.log(
      `[NestApplication] App running on port: ${config.get(APP_PORT)} with version: ${config.get(APP_VER)}`,
    );
  });
}

bootstrap();
