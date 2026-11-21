import {
  BadRequestException, ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

export const SORT_FIELDS = [
  'title',
  'author',
  'isbn',
  'totalCopies',
  'availableCopies',
] as const;
export type SortField = (typeof SORT_FIELDS)[number];

const SORTS: Record<SortField, Prisma.BookOrderByWithRelationInput> = {
  title: { title: 'asc' },
  author: { author: 'asc' },
  isbn: { isbn: 'asc' },
  totalCopies: { totalCopies: 'asc' },
  availableCopies: { availableCopies: 'asc' },
};

export interface BookQuery {
  genreId?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: SortField;
}

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: BookQuery) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));

    const where: Prisma.BookWhereInput = {};
    if (query.genreId) where.genreId = query.genreId;
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { author: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // The id tie-breaker keeps page order stable when two books share a value
    const orderBy: Prisma.BookOrderByWithRelationInput[] = query.sortBy
      ? [SORTS[query.sortBy], { id: 'asc' }]
      : [{ id: 'asc' }];

    const [data, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
        include: { genre: true },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { genre: true },
    });
    if (!book) throw new NotFoundException(`Book ${id} not found`);
    return book;
  }

  async create(dto: CreateBookDto) {
    await this.ensureGenreExists(dto.genreId);
    try {
      return await this.prisma.book.create({
        data: {
          title: dto.title,
          author: dto.author,
          isbn: dto.isbn,
          description: dto.description ?? `${dto.title} by ${dto.author}.`,
          coverImage: dto.coverImage,
          totalCopies: dto.totalCopies,
          availableCopies: dto.totalCopies,
          genreId: dto.genreId,
        },
        include: { genre: true },
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.findOne(id);
    if (dto.genreId !== undefined) await this.ensureGenreExists(dto.genreId);

    const { totalCopies, ...rest } = dto;
    const data: Prisma.BookUncheckedUpdateInput = { ...rest };
    if (totalCopies !== undefined) {
      data.totalCopies = totalCopies;
      data.availableCopies = Math.max(
        0,
        book.availableCopies + totalCopies - book.totalCopies,
      );
    }

    try {
      return await this.prisma.book.update({
        where: { id },
        data,
        include: { genre: true },
      });
    } catch (e) {
      this.handleError(e);
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.book.delete({ where: { id } });
  }

  private async ensureGenreExists(genreId: number) {
    const genre = await this.prisma.genre.findUnique({ where: { id: genreId } });
    if (!genre) throw new BadRequestException(`Genre ${genreId} does not exist`);
  }

  private handleError(e: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      throw new ConflictException('A book with that ISBN already exists');
    }
    throw e;
  }
}