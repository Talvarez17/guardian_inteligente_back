import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentFormService } from './payment-form.service';
import { PaymentFormController } from './payment-form.controller';
import { PaymentForm } from './entities/payment-form.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentForm])],
  controllers: [PaymentFormController],
  providers: [PaymentFormService],
  exports: [PaymentFormService],
})
export class PaymentFormModule {}
