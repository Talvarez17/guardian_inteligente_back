import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentBillingService } from './establishment-billing.service';
import { EstablishmentBillingController } from './establishment-billing.controller';
import { EstablishmentBilling } from './entities/establishment-billing.entity';
import { EstablishmentModule } from '../establishment/establishment.module';
import { PaymentMethodModule } from '../payment-method/payment-method.module';
import { PaymentFormModule } from '../payment-form/payment-form.module';

@Module({
  imports: [TypeOrmModule.forFeature([EstablishmentBilling]), EstablishmentModule, PaymentMethodModule, PaymentFormModule],
  controllers: [EstablishmentBillingController],
  providers: [EstablishmentBillingService],
  exports: [EstablishmentBillingService],
})
export class EstablishmentBillingModule {}
