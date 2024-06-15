import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import configConstant from './constant/config.constant';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Enable shutdownhooks
  app.enableShutdownHooks();

  // Overide nest default logger in production mode
  if (config.get(configConstant.NODE_ENV) === 'production') {
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  }

  // Enable swagger
  const swaggerCfg = new DocumentBuilder()
    .setTitle('Median')
    .setDescription('The Median API Description')
    .setVersion('0.1')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swaggerCfg);
  SwaggerModule.setup('/api', app, swaggerDoc);

  await app.listen(config.get(configConstant.APP_PORT)).then(() => {
    Logger.log(
      `[NestApplication] Nest application running on port ${config.get(configConstant.APP_PORT)}`,
    );
  });
}
bootstrap();
