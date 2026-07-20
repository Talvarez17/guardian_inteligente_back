import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class CreateChecklistItemTypeDto {

    @ApiProperty({ example: 'documentation' })
    @IsString()
    name: string;
}
