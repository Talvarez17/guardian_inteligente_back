import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePaymentRecordDto } from './create-payment-record.dto';

export class UpdatePaymentRecordDto extends PartialType(OmitType(CreatePaymentRecordDto, ['establishment_id'] as const)) {}
