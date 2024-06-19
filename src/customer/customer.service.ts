import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findOneByEmail(email: string): Promise<Customer> {
    return this.customerRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<Customer> {
    return await this.customerRepository.findOne({
      where: { id },
    });
  }

  async create(customer: CreateCustomerDto): Promise<Customer> {
    const newCustomer = new Customer();
    newCustomer.firstName = customer.firstName;
    newCustomer.lastName = customer.lastName;
    newCustomer.email = customer.email;
    newCustomer.password = customer.password;
    newCustomer.createdAt = new Date();
    newCustomer.updatedAt = new Date();

    const createdCustomer = await this.customerRepository.save(newCustomer);

    return createdCustomer;
  }
}
