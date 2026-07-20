import { PartialType } from '@nestjs/swagger';
import { CreateChecklistItemTypeDto } from './create-checklist-item-type.dto';

export class UpdateChecklistItemTypeDto extends PartialType(CreateChecklistItemTypeDto) {}
