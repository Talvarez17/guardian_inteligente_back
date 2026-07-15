import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from "class-validator";

export class ChangePassDTO {

    @ApiProperty({ example: '@Tomas17', required: true })
    @IsString()
    currentPassword: string;

    @ApiProperty({ example: '@@Hola82', required: true })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    newPassword: string;
}