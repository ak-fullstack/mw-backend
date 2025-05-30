import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomerService {

  constructor(
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) { }

  async create(createCustomerDto: CreateCustomerDto, token): Promise<any> {
    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (payload.purpose !== 'register') {
        throw new UnauthorizedException('Invalid token');
      }

      const customer = this.customerRepository.create({ ...createCustomerDto, emailId: payload.email.toLowerCase() });
      await customer.setPassword(createCustomerDto.password);
      await this.customerRepository.save(customer);
      return { message: 'Registration Successful' }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired. Please request a new one.');
      }
      throw new UnauthorizedException('Invalid or expired token');
    }

  }


  async findByCustomerEmail(email: string): Promise<any> {
    const customer = await this.customerRepository.findOne({
      where: { emailId: email },
      select: ['id', 'emailId', 'passwordHash', 'role'] // include passwordHash explicitly
    });
    return customer;
  }

  async updateCustomer(updateCustomerDto: UpdateCustomerDto, token): Promise<any> {

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });


      if (payload.purpose !== 'update-customer') {
        throw new UnauthorizedException('Invalid token');
      }

      const email = payload.email.toLowerCase();
      const customer = await this.customerRepository.findOneBy({ emailId: email });
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const { password, ...rest } = updateCustomerDto;
      Object.assign(customer, rest);
      if (password) {
        await customer.setPassword(password);
      }
      await this.customerRepository.save(customer);


      return { message: 'Updated Successfully' }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired. Please request a new one.');
      }
      throw new UnauthorizedException('Invalid or expired token');
    }

  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find(); // If using TypeORM
  }


}
