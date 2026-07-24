import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstablishmentChecklistItemService } from './establishment-checklist-item.service';
import { EstablishmentChecklistItemController } from './establishment-checklist-item.controller';
import { EstablishmentChecklistItem } from './entities/establishment-checklist-item.entity';
import { EstablishmentModule } from '../establishment/establishment.module';
import { ChecklistItemTypeModule } from '../checklist-item-type/checklist-item-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstablishmentChecklistItem]),
    EstablishmentModule,
    ChecklistItemTypeModule,
  ],
  controllers: [EstablishmentChecklistItemController],
  providers: [EstablishmentChecklistItemService],
  exports: [EstablishmentChecklistItemService],
})
export class EstablishmentChecklistItemModule {}
