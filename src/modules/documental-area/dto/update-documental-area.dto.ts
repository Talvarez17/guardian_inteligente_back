import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateDocumentalAreaDto } from './create-documental-area.dto';

export class UpdateDocumentalAreaDto extends PartialType(CreateDocumentalAreaDto) {

    @ApiPropertyOptional({ example: true, description: 'Activa o desactiva el registro' })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}
