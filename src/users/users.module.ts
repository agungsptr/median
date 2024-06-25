import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config/config';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: config.jwt.SECRET,
      signOptions: { expiresIn: config.jwt.EXPIRES },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
