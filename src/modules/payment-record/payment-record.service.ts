import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRecord } from './entities/payment-record.entity';
import { CreatePaymentRecordDto } from './dto/create-payment-record.dto';
import { UpdatePaymentRecordDto } from './dto/update-payment-record.dto';
import { EstablishmentService } from '../establishment/establishment.service';
import { EstablishmentBillingService } from '../establishment-billing/establishment-billing.service';
import { EstablishmentOperationService } from '../establishment-operation/establishment-operation.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { buildPaginationMeta } from '../../common/utils/pagination.util';

const SORTABLE_FIELDS = ['period_year', 'period_month', 'folio', 'amount'];

export interface PaymentSummary {
  totalPaid: number;
  monthlyBill: number | null;
  monthsElapsed: number | null;
  expectedTotal: number | null;
  overdueBalance: number | null;
}

@Injectable()
export class PaymentRecordService {

  constructor(
    @InjectRepository(PaymentRecord) private readonly paymentRecordRepository: Repository<PaymentRecord>,
    private readonly establishmentService: EstablishmentService,
    private readonly establishmentBillingService: EstablishmentBillingService,
    private readonly establishmentOperationService: EstablishmentOperationService,
  ) { }

  async createPaymentRecord(createPaymentRecordDto: CreatePaymentRecordDto): Promise<PaymentRecord> {
    const { establishment_id, ...recordData } = createPaymentRecordDto;

    const establishment = await this.establishmentService.findOneEstablishment(establishment_id);

    const paymentRecord = this.paymentRecordRepository.create({
      ...recordData,
      establishment,
    });

    return this.paymentRecordRepository.save(paymentRecord);
  }

  async findAllByEstablishment(establishmentId: string, query: PaginationQueryDto): Promise<PaginatedResponse<PaymentRecord>> {
    await this.establishmentService.findOneEstablishment(establishmentId);

    const { page, limit, sortBy, order, search } = query;

    const sortField = SORTABLE_FIELDS.includes(sortBy ?? '') ? sortBy! : 'period_year';

    const qb = this.paymentRecordRepository
      .createQueryBuilder('paymentRecord')
      .where('paymentRecord.establishment_id = :establishmentId', { establishmentId });

    if (search) {
      qb.andWhere('paymentRecord.folio ILIKE :search', { search: `%${search}%` });
    }

    qb.orderBy(`paymentRecord.${sortField}`, order)
      .addOrderBy('paymentRecord.period_month', order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return { data, meta: buildPaginationMeta(total, page, limit) };
  }

  async findOnePaymentRecord(id: number): Promise<PaymentRecord> {
    const paymentRecord = await this.paymentRecordRepository.findOne({ where: { id } });

    if (!paymentRecord) {
      throw new NotFoundException('Payment record not found');
    }

    return paymentRecord;
  }

  async updatePaymentRecord(id: number, updatePaymentRecordDto: UpdatePaymentRecordDto): Promise<PaymentRecord> {
    const paymentRecord = await this.findOnePaymentRecord(id);

    Object.assign(paymentRecord, updatePaymentRecordDto);

    return this.paymentRecordRepository.save(paymentRecord);
  }

  async deletePaymentRecord(id: number): Promise<{ message: string }> {
    const paymentRecord = await this.findOnePaymentRecord(id);

    await this.paymentRecordRepository.remove(paymentRecord);

    return { message: 'Payment record removed' };
  }

  async getSummary(establishmentId: string): Promise<PaymentSummary> {
    await this.establishmentService.findOneEstablishment(establishmentId);

    const raw = await this.paymentRecordRepository
      .createQueryBuilder('paymentRecord')
      .select('COALESCE(SUM(paymentRecord.amount), 0)', 'sum')
      .where('paymentRecord.establishment_id = :establishmentId', { establishmentId })
      .getRawOne<{ sum: string }>();

    const totalPaid = Number(raw?.sum ?? 0);

    const billing = await this.establishmentBillingService.findByEstablishment(establishmentId).catch(() => null);
    const operation = await this.establishmentOperationService.findByEstablishment(establishmentId).catch(() => null);

    const installDate = operation?.real_install_date ?? operation?.install_date;

    if (!billing || !installDate) {
      return { totalPaid, monthlyBill: billing?.monthly_bill ?? null, monthsElapsed: null, expectedTotal: null, overdueBalance: null };
    }

    const start = new Date(installDate);
    const now = new Date();

    const monthsElapsed = Math.max(
      (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()) + 1,
      0,
    );

    const expectedTotal = billing.monthly_bill * monthsElapsed;
    const overdueBalance = Math.max(expectedTotal - totalPaid, 0);

    return { totalPaid, monthlyBill: billing.monthly_bill, monthsElapsed, expectedTotal, overdueBalance };
  }
}
