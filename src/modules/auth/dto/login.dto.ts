import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from "class-validator";

export class LoginDto {

    @ApiProperty({ example: 'usuario@guardian.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '@Tomas17' })
    @IsString()
    password: string;
}