import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateChecklistItemTypeDto } from './create-checklist-item-type.dto';

export class UpdateChecklistItemTypeDto extends PartialType(CreateChecklistItemTypeDto) {

    @ApiPropertyOptional({ example: true, description: 'Activa o desactiva el registro' })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}
