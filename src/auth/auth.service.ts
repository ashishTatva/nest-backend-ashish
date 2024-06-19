import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { CreateCustomerDto } from 'src/customer/dto/create-customer.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly customerService: CustomerService,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<Customer, 'password'> | null> {
    const customer = await this.customerService.findOneByEmail(email);
    if (!customer) {
      throw new NotFoundException(
        'This account has not been setup on the platform',
      );
    }

    const passwordMatch = await this.comparePassword(pass, customer.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Password is incorrect');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = customer;
    return result;
  }

  public async login(customer: CreateCustomerDto) {
    const accessToken = await this.getTokens(customer);

    return { customer, accessToken };
  }

  async getTokens(customer: Omit<CreateCustomerDto, 'password'>) {
    const accessToken = await this.jwtService.signAsync(customer, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRY'),
    });

    return accessToken;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    const match = await bcrypt.compare(enteredPassword, dbPassword);
    return match;
  }

  private async hashPassword(password: string) {
    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    return hash;
  }

  public async create(user: CreateCustomerDto) {
    const userExists = await this.customerService.findOneByEmail(user.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }

    const pass = await this.hashPassword(user.password);

    const newUser = await this.customerService.create({
      ...user,
      password: pass,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = newUser;

    const accessToken = await this.getTokens(result);

    return { user: result, accessToken };
  }
}
