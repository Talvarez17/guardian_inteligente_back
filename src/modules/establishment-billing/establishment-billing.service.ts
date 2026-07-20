import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstablishmentBilling } from './entities/establishment-billing.entity';
import { UpsertEstablishmentBillingDto } from './dto/upsert-establishment-billing.dto';
import { EstablishmentService } from '../establishment/establishment.service';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { PaymentFormService } from '../payment-form/payment-form.service';

@Injectable()
export class EstablishmentBillingService {

  constructor(
    @InjectRepository(EstablishmentBilling) private readonly establishmentBillingRepository: Repository<EstablishmentBilling>,
    private readonly establishmentService: EstablishmentService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly paymentFormService: PaymentFormService,
  ) { }

  async upsertBilling(establishmentId: string, dto: UpsertEstablishmentBillingDto): Promise<EstablishmentBilling> {
    await this.establishmentService.findOneEstablishment(establishmentId);

    const { payment_method_id, payment_form_id, ...billingData } = dto;

    const payment_method = await this.paymentMethodService.findOnePaymentMethod(payment_method_id);
    const payment_form = await this.paymentFormService.findOnePaymentForm(payment_form_id);

    let billing = await this.establishmentBillingRepository.findOne({ where: { establishment_id: establishmentId } });

    if (!billing) {
      billing = this.establishmentBillingRepository.create({
        establishment_id: establishmentId,
        ...billingData,
        payment_method,
        payment_form,
      });
    } else {
      Object.assign(billing, billingData);
      billing.payment_method = payment_method;
      billing.payment_form = payment_form;
    }

    return this.establishmentBillingRepository.save(billing);
  }

  async findByEstablishment(establishmentId: string): Promise<EstablishmentBilling> {
    const billing = await this.establishmentBillingRepository.findOne({ where: { establishment_id: establishmentId } });

    if (!billing) {
      throw new NotFoundException('Establishment billing data not found');
    }

    return billing;
  }
}
