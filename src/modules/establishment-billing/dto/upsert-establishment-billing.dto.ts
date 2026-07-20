import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive } from "class-validator";

export class UpsertEstablishmentBillingDto {

    @ApiProperty({ example: 1500.5 })
    @IsNumber()
    @IsPositive()
    monthly_bill: number;

    @ApiProperty({ example: 1, description: 'Id del método de pago' })
    @IsInt()
    @IsPositive()
    payment_method_id: number;

    @ApiProperty({ example: 1, description: 'Id de la forma de pago' })
    @IsInt()
    @IsPositive()
    payment_form_id: number;
}
