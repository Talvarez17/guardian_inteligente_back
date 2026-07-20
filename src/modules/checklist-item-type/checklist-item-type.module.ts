import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChecklistItemTypeService } from './checklist-item-type.service';
import { ChecklistItemTypeController } from './checklist-item-type.controller';
import { ChecklistItemType } from './entities/checklist-item-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChecklistItemType])],
  controllers: [ChecklistItemTypeController],
  providers: [ChecklistItemTypeService],
  exports: [ChecklistItemTypeService],
})
export class ChecklistItemTypeModule {}
