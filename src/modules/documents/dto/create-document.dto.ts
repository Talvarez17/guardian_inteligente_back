import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsPositive, IsString, IsUUID } from "class-validator";

export class CreateDocumentDto {

    @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'Id del establecimiento al que pertenece este documento' })
    @IsUUID()
    establishment_id: string;

    @ApiProperty({ example: 'Política de privacidad' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'Id del área documental a la que pertenece este documento' })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    area_id: number;

    @ApiProperty({ example: 'v1' })
    @IsString()
    version: string;

    @ApiProperty({ example: '2027-01-01' })
    @IsDateString()
    expiration_date: string;

    @ApiPropertyOptional({ example: 'Documento revisado por legal' })
    @IsOptional()
    @IsString()
    comments?: string;
}
