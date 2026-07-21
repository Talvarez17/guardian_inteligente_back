import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreatePaymentMethodDto } from './create-payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(CreatePaymentMethodDto) {

    @ApiPropertyOptional({ example: true, description: 'Activa o desactiva el registro' })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}
