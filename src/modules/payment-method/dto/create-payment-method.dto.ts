import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class CreatePaymentMethodDto {

    @ApiProperty({ example: 'Transferencia bancaria' })
    @IsString()
    name: string;
}
