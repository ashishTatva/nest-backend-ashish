import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { RentalService } from './rental.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { StandardResponse } from 'src/utils/interfaces/StandardResponse.Interface';
import { Rental } from './entities/rental.entity';
import { PaginationDto } from 'src/book/dto/pagination.dto';
import {
  PaginationData,
  getPagingData,
} from 'src/utils/interfaces/PaginationResponse.Interface';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post('rent-a-book')
  async create(@Body() createRentalDto: CreateRentalDto, @Request() req) {
    const rentalDetail = await this.rentalService.rentBook(
      +createRentalDto.bookId,
      req.user.id,
      createRentalDto.isSubmit,
    );

    const result: StandardResponse<Rental> = {
      result: rentalDetail,
      message: createRentalDto.isSubmit
        ? 'Book submitted successfully'
        : 'Book rented successfully',
    };

    return result;
  }

  @Post()
  async findAll(
    @Body() paginationDto: PaginationDto,
    @Request() req,
  ): Promise<StandardResponse<PaginationData<Rental>>> {
    const data = await this.rentalService.findAll(req.user.id, paginationDto);

    const result: StandardResponse<PaginationData<Rental>> = {
      result: getPagingData(data, paginationDto.page, paginationDto.pageSize),
      message: 'Rental Details Fetched Successfully.',
    };

    return result;
  }
}
