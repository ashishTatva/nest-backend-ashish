import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAndCountResponse } from 'src/utils/interfaces/PaginationResponse.Interface';
import { Book } from './entities/book.entity';
import { PaginationDto } from './dto/pagination.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  async changeQuantity(bookId: number, isIncrement = true): Promise<void> {
    const book = await this.findOneById(bookId);

    if (isIncrement) {
      book.quantity += 1;
      await this.bookRepository.save(book);
    } else {
      if (book.quantity > 0) {
        book.quantity -= 1;
        await this.bookRepository.save(book);
      } else {
        throw new Error('Book is out of stock');
      }
    }
  }

  async findAll(
    customerId: number,
    {
      page = 0,
      pageSize = 10,
      sortModel = [{ field: 'id', sort: 'ASC' }],
    }: PaginationDto,
  ): Promise<FindAndCountResponse<Book>> {
    const order = {};
    sortModel?.forEach((obj) => {
      order[obj.field] = obj.sort.toUpperCase();
    });

    const [rows, totalRecords] = await this.bookRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: order,
    });

    return { rows, totalRecords };
  }

  async findOneById(bookId: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${bookId} not found`);
    }
    return book;
  }
}
