import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsInt, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateDocumentDto {

    @ApiProperty({ example: 'Política de privacidad' })
    @IsString()
    name: string;

    @ApiProperty({ example: 1, description: 'Id del área documental a la que pertenece este documento' })
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    areaId: number;

    @ApiProperty({ example: 'v1' })
    @IsString()
    version: string;

    @ApiProperty({ example: '2027-01-01' })
    @Type(() => Date)
    @IsDate()
    expirationDate: Date;

    @ApiPropertyOptional({ example: 'Documento revisado por legal' })
    @IsOptional()
    @IsString()
    comments?: string;
}
