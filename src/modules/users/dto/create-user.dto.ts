import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsOptional, IsPositive, IsString, IsStrongPassword } from 'class-validator';

export class CreateUserDto {

    @ApiProperty({ example: 'Tomas', required: true })
    @IsString()
    name: string;

    @ApiProperty({ example: 'Alvarez', required: true })
    @IsString()
    firstLastName: string;

    @ApiProperty({ example: 'Lopez', required: false })
    @IsString()
    @IsOptional()
    secondLastName?: string;

    @ApiProperty({ example: 'usuario@guardian.com', required: true })
    @IsEmail()
    email: string

    @ApiProperty({ example: '@Tomas17', required: true })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })
    password: string

    @ApiProperty({ example: 1, description: 'Id of the role to assign to this user' })
    @IsInt()
    @IsPositive()
    roleId: number

    @ApiProperty({ example: 1, description: 'Id of the documental area this user is responsible for', required: false })
    @IsOptional()
    @IsInt()
    @IsPositive()
    documentalAreaId?: number

}
