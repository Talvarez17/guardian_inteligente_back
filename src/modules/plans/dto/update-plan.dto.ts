import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdatePlanDto {

    @ApiPropertyOptional({ example: 'Plan Premium' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiPropertyOptional({ example: 7, description: 'Trial period, in days' })
    @IsOptional()
    @IsInt()
    @Min(0)
    trial?: number;

    @ApiPropertyOptional({ example: 'Incluye soporte prioritario' })
    @IsOptional()
    @IsString()
    comments?: string;

    @ApiPropertyOptional({ example: [1, 2, 3], description: 'Ids of the plan features included in this plan' })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    featureIds?: number[];

    @ApiPropertyOptional({ example: true, description: 'Whether the plan is active' })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}
