import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserEntity } from './entities/user.entity';
import { hashPassword } from 'src/common/utils';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await hashPassword(createUserDto.password);

    return new UserEntity(
      await this.prismaService.user.create({ data: createUserDto }),
    );
  }

  async findAll() {
    return (await this.prismaService.user.findMany()).map(
      (user) => new UserEntity(user),
    );
  }

  async findOne(id: string) {
    return new UserEntity(
      await this.prismaService.user.findFirstOrThrow({ where: { id } }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    return new UserEntity(
      await this.prismaService.user.update({
        where: { id },
        data: updateUserDto,
      }),
    );
  }

  async remove(id: string) {
    return new UserEntity(
      await this.prismaService.user.delete({ where: { id } }),
    );
  }
}
