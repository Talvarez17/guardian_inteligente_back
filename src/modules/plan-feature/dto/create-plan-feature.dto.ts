import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePlanFeatureDto {

    @ApiProperty({ example: 'Reportes avanzados' })
    @IsString()
    name: string;
}


