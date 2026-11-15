import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

const toSlug = (name: string) => name.trim().toLowerCase().replace(/\s+/g, '-');

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateGenreDto) {
    try {
      return await this.prisma.genre.create({
        data: { name: dto.name, slug: dto.slug ?? toSlug(dto.name) },
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  findAll() {
    return this.prisma.genre.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { books: true } } },
    });
  }

  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });
    if (!genre) throw new NotFoundException(`Genre ${id} not found`);
    return genre;
  }

  async update(id: number, dto: UpdateGenreDto) {
    await this.findOne(id);
    try {
      return await this.prisma.genre.update({ where: { id }, data: dto });
    } catch (e) {
      this.handleError(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    const books = await this.prisma.book.count({ where: { genreId: id } });
    if (books > 0) {
      throw new ConflictException('Cannot delete a genre that still has books');
    }
    return this.prisma.genre.delete({ where: { id } });
  }

  private handleError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new ConflictException('A genre with that name or slug already exists');
    }
    throw e;
  }
}