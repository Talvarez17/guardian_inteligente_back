import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'status'];

@Injectable()
export class PaymentMethodService {

  constructor(
    @InjectRepository(PaymentMethod) private readonly paymentMethodRepository: Repository<PaymentMethod>
  ) { }

  async createPaymentMethod(createPaymentMethodDto: CreatePaymentMethodDto): Promise<PaymentMethod> {
    const existing = await this.paymentMethodRepository.findOne({
      where: { name: createPaymentMethodDto.name }
    })

    if (existing) {
      throw new ConflictException('Payment method already exists');
    }

    const paymentMethod = this.paymentMethodRepository.create(createPaymentMethodDto);
    return this.paymentMethodRepository.save(paymentMethod);
  }

  async findAllPaymentMethods(query: PaginationQueryDto): Promise<PaginatedResponse<PaymentMethod>> {
    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.paymentMethodRepository.createQueryBuilder('paymentMethod');

    if (search) {
      qb.where('paymentMethod.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`paymentMethod.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOnePaymentMethod(id: number): Promise<PaymentMethod> {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: { id }
    })

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    return paymentMethod;
  }

  async updatePaymentMethod(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto): Promise<PaymentMethod> {
    const paymentMethod = await this.findOnePaymentMethod(id);

    Object.assign(paymentMethod, updatePaymentMethodDto);

    return this.paymentMethodRepository.save(paymentMethod);
  }

  async deletePaymentMethod(id: number): Promise<{ message: string }> {
    const paymentMethod = await this.findOnePaymentMethod(id);

    paymentMethod.status = false

    await this.paymentMethodRepository.save(paymentMethod);

    return { message: 'Payment method deleted' };
  }
}
