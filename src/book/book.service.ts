import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAndCountResponse } from 'src/utils/interfaces/PaginationResponse.Interface';
import { Book } from './entities/book.entity';
import { PaginationDto } from './dto/pagination.dto';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
      sortModel = [{ field: 'b.id', sort: 'ASC' }],
    }: PaginationDto,
  ): Promise<FindAndCountResponse<Book>> {
    const order = {};
    sortModel?.forEach((obj) => {
      order[obj.field] = obj.sort.toUpperCase();
    });

    const queryBuilder: SelectQueryBuilder<Book> = this.bookRepository
      .createQueryBuilder('b')
      .leftJoin(
        'rental',
        'r',
        'b.id = r.book_id AND r.customer_id = :customerId',
        { customerId },
      )
      .where('r.book_id IS NULL AND r.submitted_at IS NULL')
      .addSelect(['b.*'])
      .orderBy(order)
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [rows, totalRecords] = await queryBuilder.getManyAndCount();

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
