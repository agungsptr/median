import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import { LogMiddleware } from './log/log.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    WinstonModule.forRoot({
      format: winston.format.json(),
      level: 'info',
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: './logs/app.log' }),
      ],
    }),
    PrismaModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // Applies middleware
    consumer.apply(LogMiddleware).forRoutes({
      path: 'api/*',
      method: RequestMethod.ALL,
    });
  }
}
