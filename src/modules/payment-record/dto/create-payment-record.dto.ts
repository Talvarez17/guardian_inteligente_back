import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, IsString, IsUUID, Max, Min } from "class-validator";

export class CreatePaymentRecordDto {

    @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6', description: 'Id del establecimiento al que pertenece este pago' })
    @IsUUID()
    establishment_id: string;

    @ApiProperty({ example: 7, description: 'Mes (1-12) que cubre este pago' })
    @IsInt()
    @Min(1)
    @Max(12)
    period_month: number;

    @ApiProperty({ example: 2026 })
    @IsInt()
    @Min(2000)
    period_year: number;

    @ApiProperty({ example: 'F-000123' })
    @IsString()
    folio: string;

    @ApiProperty({ example: 1500.5 })
    @IsNumber()
    @IsPositive()
    amount: number;
}
