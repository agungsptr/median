import { Logger } from 'winston';
import { LogMiddleware } from './log.middleware';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER, WinstonModule } from 'nest-winston';
import * as winston from 'winston';

describe('LogMiddleware', () => {
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        WinstonModule.forRoot({
          format: winston.format.json(),
          level: 'info',
          transports: [
            new winston.transports.Console(),
            new winston.transports.File({ filename: './logs/app.log' }),
          ],
        }),
      ],
    }).compile();

    logger = module.get<Logger>(WINSTON_MODULE_PROVIDER);
  });

  it('should be defined', () => {
    expect(new LogMiddleware(logger)).toBeDefined();
  });
});
