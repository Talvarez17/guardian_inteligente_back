import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsPositive, IsString, IsUUID, Length, Matches } from "class-validator";
import { EstablishmentStatus } from "../entities/establishment.entity";

export class CreateEstablishmentDto {

    @ApiProperty({ example: 'Sucursal Centro' })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Comercializadora Ejemplo S.A. de C.V.' })
    @IsString()
    business_name: string;

    @ApiProperty({ example: 'COE850101AB3', description: 'RFC de persona moral (12 caracteres)' })
    @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase().trim() : value)
    @IsString()
    @Length(12, 12, { message: 'RFC must be 12 characters long' })
    @Matches(/^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/, { message: 'RFC does not have a valid company format' })
    rfc: string;

    @ApiProperty({ example: 1, description: 'Id del giro comercial asignado a este establecimiento' })
    @IsInt()
    @IsPositive()
    turnover_id: number;

    @ApiProperty({ example: 'Av. Reforma' })
    @IsString()
    street: string;

    @ApiProperty({ example: 'Centro' })
    @IsString()
    neighborhood: string;

    @ApiProperty({ example: '123' })
    @IsString()
    ext_number: string;

    @ApiPropertyOptional({ example: 'A' })
    @IsOptional()
    @IsString()
    int_number?: string;

    @ApiProperty({ example: '06000' })
    @IsString()
    @Matches(/^\d{5}$/, { message: 'Postal code must be 5 digits long' })
    postal_code: string;

    @ApiProperty({ example: 'CDMX' })
    @IsString()
    state: string;

    @ApiProperty({ example: 'Ciudad de México' })
    @IsString()
    city: string;

    @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'Id del usuario designado como responsable de este establecimiento' })
    @IsUUID()
    designated_person_id: string;

    @ApiProperty({ example: 1, description: 'Id del plan asignado a este establecimiento' })
    @IsInt()
    @IsPositive()
    plan_id: number;

    @ApiPropertyOptional({ enum: EstablishmentStatus, example: EstablishmentStatus.PROSPECT, description: 'Si se omite, queda en "prospecto"' })
    @IsOptional()
    @IsEnum(EstablishmentStatus)
    establishment_status?: EstablishmentStatus;

    @ApiPropertyOptional({ example: 'Cliente referido por sucursal Norte' })
    @IsOptional()
    @IsString()
    comment?: string;
}
