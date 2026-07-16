import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanFeatureService } from './plan-feature.service';
import { PlanFeatureController } from './plan-feature.controller';
import { PlanFeature } from './entities/plan-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanFeature])],
  controllers: [PlanFeatureController],
  providers: [PlanFeatureService],
  exports: [PlanFeatureService],
})
export class PlanFeatureModule {}
