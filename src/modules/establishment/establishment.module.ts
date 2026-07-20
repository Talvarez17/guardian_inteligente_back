import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentService } from './establishment.service';
import { EstablishmentController } from './establishment.controller';
import { Establishment } from './entities/establishment.entity';
import { PlansModule } from '../plans/plans.module';
import { TurnoverModule } from '../turnover/turnover.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Establishment]), PlansModule, TurnoverModule, UsersModule],
  controllers: [EstablishmentController],
  providers: [EstablishmentService],
  exports: [EstablishmentService],
})
export class EstablishmentModule {}
