import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Rental } from './entities/rental.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { BookService } from 'src/book/book.service';
import { CustomerService } from 'src/customer/customer.service';
import { PaginationDto } from 'src/book/dto/pagination.dto';
import { FindAndCountResponse } from 'src/utils/interfaces/PaginationResponse.Interface';

@Injectable()
export class RentalService {
  constructor(
    @InjectRepository(Rental)
    private rentalRepository: Repository<Rental>,
    private bookService: BookService,
    private customerService: CustomerService,
  ) {}

  async findAll(
    customerId: number,
    {
      page = 0,
      pageSize = 10,
      sortModel = [{ field: 'rentedAt', sort: 'DESC' }],
    }: PaginationDto,
  ): Promise<FindAndCountResponse<Rental>> {
    const order = {};
    sortModel?.forEach((obj) => {
      order[obj.field] = obj.sort.toUpperCase();
    });

    const [rows, totalRecords] = await this.rentalRepository.findAndCount({
      skip: page * pageSize,
      take: pageSize,
      order: order,
      where: { customer: { id: customerId }, submittedAt: IsNull() },
    });

    return { rows, totalRecords };
  }

  async rentBook(
    bookId: number,
    customerId: number,
    isSubmit: boolean,
  ): Promise<Rental> {
    const book = await this.bookService.findOneById(bookId);
    const customer = await this.customerService.findOneById(customerId);

    if (!book || !customer) {
      throw new NotFoundException('Book or Customer not found');
    }

    let rental: Rental;
    const existingRental = await this.rentedBookDetail(bookId, customerId);

    if (!isSubmit) {
      if (existingRental) {
        throw new BadRequestException('Book is already rented by the customer');
      }

      rental = this.rentalRepository.create({
        book,
        customer,
        rentedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await this.bookService.changeQuantity(bookId, false);
    } else {
      if (!existingRental) {
        throw new NotFoundException(
          'No active rental found for this book and customer',
        );
      }

      rental = existingRental;
      rental.submittedAt = new Date();
      rental.updatedAt = new Date();

      await this.bookService.changeQuantity(bookId, true);
      await this.rentalRepository.remove(rental);
      return;
    }

    return this.rentalRepository.save(rental);
  }

  async rentedBookDetail(bookId: number, customerId: number): Promise<Rental> {
    return this.rentalRepository.findOne({
      where: {
        submittedAt: IsNull(),
        book: { id: bookId },
        customer: { id: customerId },
      },
    });
  }
}
