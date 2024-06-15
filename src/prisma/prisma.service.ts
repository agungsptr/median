import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }

  onModuleInit() {
    this.$connect();
    Logger.log('[PrismaService] Connect prisma');
  }
  onModuleDestroy() {
    this.$disconnect();
    Logger.log('[PrismaService] Disconnect prisma');
  }
}
