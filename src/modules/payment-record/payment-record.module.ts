import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRecordService } from './payment-record.service';
import { PaymentRecordController } from './payment-record.controller';
import { PaymentRecord } from './entities/payment-record.entity';
import { EstablishmentModule } from '../establishment/establishment.module';
import { EstablishmentBillingModule } from '../establishment-billing/establishment-billing.module';
import { EstablishmentOperationModule } from '../establishment-operation/establishment-operation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRecord]),
    EstablishmentModule,
    EstablishmentBillingModule,
    EstablishmentOperationModule,
  ],
  controllers: [PaymentRecordController],
  providers: [PaymentRecordService],
  exports: [PaymentRecordService],
})
export class PaymentRecordModule {}
