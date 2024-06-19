import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    return this.prismaService.article.create({ data: createArticleDto });
  }

  async findAll() {
    return this.prismaService.article.findMany({ where: { published: true } });
  }

  async findDrafts() {
    return this.prismaService.article.findMany({ where: { published: false } });
  }

  async findOne(id: string) {
    return this.prismaService.article.findUniqueOrThrow({ where: { id } });
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.prismaService.article.update({
      where: { id },
      data: updateArticleDto,
    });
  }

  async remove(id: string) {
    return this.prismaService.article.delete({ where: { id } });
  }
}
