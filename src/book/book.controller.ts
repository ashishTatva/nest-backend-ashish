import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookService } from './book.service';
import { PaginationDto } from './dto/pagination.dto';
import { StandardResponse } from 'src/utils/interfaces/StandardResponse.Interface';
import {
  PaginationData,
  getPagingData,
} from 'src/utils/interfaces/PaginationResponse.Interface';
import { Book } from './entities/book.entity';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Body() paginationDto: PaginationDto,
    @Request() req,
  ): Promise<StandardResponse<PaginationData<Book>>> {
    const data = await this.bookService.findAll(req.user.id, paginationDto);

    const result: StandardResponse<PaginationData<Book>> = {
      result: getPagingData(data, paginationDto.page, paginationDto.pageSize),
      message: 'Books Fetched Successfully.',
    };

    return result;
  }
}
