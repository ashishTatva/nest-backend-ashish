import {
  Controller,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { StandardResponse } from 'src/utils/interfaces/StandardResponse.Interface';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    const data = await this.authService.login(req.user);

    const result: StandardResponse<any> = {
      result: data,
      message: 'Customer Logged in Successfully.',
    };

    return result;
  }

  @Post('signup')
  async signUp(@Body() customer: CreateCustomerDto) {
    const data = await this.authService.create(customer);

    const result: StandardResponse<any> = {
      result: data,
      message: 'Customer Created Successfully.',
    };

    return result;
  }
}
