import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentFormDto } from './dto/create-payment-form.dto';
import { UpdatePaymentFormDto } from './dto/update-payment-form.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentForm } from './entities/payment-form.entity';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['name', 'status'];

@Injectable()
export class PaymentFormService {

  constructor(
    @InjectRepository(PaymentForm) private readonly paymentFormRepository: Repository<PaymentForm>
  ) { }

  async createPaymentForm(createPaymentFormDto: CreatePaymentFormDto): Promise<PaymentForm> {
    const existing = await this.paymentFormRepository.findOne({
      where: { name: createPaymentFormDto.name }
    })

    if (existing) {
      throw new ConflictException('Payment form already exists');
    }

    const paymentForm = this.paymentFormRepository.create(createPaymentFormDto);
    return this.paymentFormRepository.save(paymentForm);
  }

  async findAllPaymentForms(query: PaginationQueryDto): Promise<PaginatedResponse<PaymentForm>> {
    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'name';

    const qb = this.paymentFormRepository.createQueryBuilder('paymentForm');

    if (search) {
      qb.where('paymentForm.name ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`paymentForm.${sortField}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOnePaymentForm(id: number): Promise<PaymentForm> {
    const paymentForm = await this.paymentFormRepository.findOne({
      where: { id }
    })

    if (!paymentForm) {
      throw new NotFoundException('Payment form not found');
    }

    return paymentForm;
  }

  async updatePaymentForm(id: number, updatePaymentFormDto: UpdatePaymentFormDto): Promise<PaymentForm> {
    const paymentForm = await this.findOnePaymentForm(id);

    Object.assign(paymentForm, updatePaymentFormDto);

    return this.paymentFormRepository.save(paymentForm);
  }

  async deletePaymentForm(id: number): Promise<{ message: string }> {
    const paymentForm = await this.findOnePaymentForm(id);

    paymentForm.status = false

    await this.paymentFormRepository.save(paymentForm);

    return { message: 'Payment form deleted' };
  }
}
