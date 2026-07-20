import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean } from "class-validator";

export class UpsertEstablishmentChecklistItemDto {

    @ApiProperty({ example: true })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    completed: boolean;
}
