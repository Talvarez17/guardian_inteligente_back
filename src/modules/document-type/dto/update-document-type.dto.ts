import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateDocumentTypeDto } from './create-document-type.dto';

export class UpdateDocumentTypeDto extends PartialType(CreateDocumentTypeDto) {

    @ApiPropertyOptional({ example: true, description: 'Activa o desactiva el registro' })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}
