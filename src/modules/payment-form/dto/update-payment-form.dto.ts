import { PartialType } from '@nestjs/swagger';
import { CreatePaymentFormDto } from './create-payment-form.dto';

export class UpdatePaymentFormDto extends PartialType(CreatePaymentFormDto) {}
