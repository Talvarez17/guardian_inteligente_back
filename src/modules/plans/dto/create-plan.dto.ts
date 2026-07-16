import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsPositive, IsString, Min } from "class-validator";

export class CreatePlanDto {

    @ApiProperty({ example: 'Plan Premium' })
    @IsString()
    name: string;

    @ApiProperty({ example: 19.99 })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({ example: 'MXN' })
    @IsString()
    currency: string;

    @ApiProperty({ example: 'week' })
    @IsString()
    frequency: string;

    @ApiProperty({ example: 7, description: 'Trial period, in days' })
    @IsInt()
    @Min(0)
    trial: number;

    @ApiProperty({ example: 3, description: 'Allowed payment retry attempts' })
    @IsInt()
    @Min(0)
    tries: number;

    @ApiProperty({ example: 'Incluye soporte prioritario' })
    @IsString()
    comments: string;

    @ApiProperty({ example: [1, 2, 3], description: 'Ids of the plan features included in this plan' })
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    featureIds: number[];
}
