import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlansService } from './plans.service';
import { PlansController } from './plans.controller';
import { Plan } from './entities/plan.entity';
import { PlanFeatureModule } from '../plan-feature/plan-feature.module';

@Module({
  imports: [TypeOrmModule.forFeature([Plan]), PlanFeatureModule],
  controllers: [PlansController],
  providers: [PlansService],
})
export class PlansModule {}
