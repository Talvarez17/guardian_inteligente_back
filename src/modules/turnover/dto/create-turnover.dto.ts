import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class CreateTurnoverDto {

    @ApiProperty({ example: 'Comercio al por menor' })
    @IsString()
    name: string;
}
