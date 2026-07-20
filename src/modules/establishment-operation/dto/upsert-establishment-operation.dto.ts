import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { EstablishmentRisk } from "../../establishment/entities/establishment.entity";

export class UpsertEstablishmentOperationDto {

    @ApiProperty({ enum: EstablishmentRisk, example: EstablishmentRisk.LOW })
    @IsEnum(EstablishmentRisk)
    risk: EstablishmentRisk;

    @ApiPropertyOptional({ example: 'Zona de alta incidencia delictiva' })
    @IsOptional()
    @IsString()
    risk_factor?: string;

    @ApiProperty({ example: false })
    @IsBoolean()
    gia: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    covia: boolean;

    @ApiProperty({ example: false })
    @IsBoolean()
    ria: boolean;

    @ApiPropertyOptional({ example: 'Cliente suspendió operaciones temporalmente' })
    @IsOptional()
    @IsString()
    inactive_factor?: string;

    @ApiProperty({ example: 4 })
    @IsInt()
    @Min(0)
    cameras: number;

    @ApiPropertyOptional({ example: '2027-01-01' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    closing_date?: Date;

    @ApiPropertyOptional({ example: '2026-08-01' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    install_date?: Date;

    @ApiPropertyOptional({ example: '2026-08-05' })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    real_install_date?: Date;
}
