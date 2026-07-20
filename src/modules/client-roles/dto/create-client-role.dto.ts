import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class CreateClientRoleDto {

    @ApiProperty({ example: 'admin' })
    @IsString()
    name: string;
}
