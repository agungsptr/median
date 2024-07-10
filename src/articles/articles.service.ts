import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    return new ArticleEntity(
      await this.prismaService.article.create({ data: createArticleDto }),
    );
  }

  async findAll() {
    return (
      await this.prismaService.article.findMany({ where: { published: true } })
    ).map((article) => new ArticleEntity(article));
  }

  async findDrafts() {
    return (
      await this.prismaService.article.findMany({ where: { published: false } })
    ).map((article) => new ArticleEntity(article));
  }

  async findOne(id: string) {
    return new ArticleEntity(
      await this.prismaService.article.findUniqueOrThrow({ where: { id } }),
    );
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    return new ArticleEntity(
      await this.prismaService.article.update({
        where: { id },
        data: updateArticleDto,
      }),
    );
  }

  async remove(id: string) {
    return new ArticleEntity(
      await this.prismaService.article.delete({ where: { id } }),
    );
  }
}
