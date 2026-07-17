import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnoverService } from './turnover.service';
import { TurnoverController } from './turnover.controller';
import { Turnover } from './entities/turnover.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turnover])],
  controllers: [TurnoverController],
  providers: [TurnoverService],
  exports: [TurnoverService],
})
export class TurnoverModule {}
