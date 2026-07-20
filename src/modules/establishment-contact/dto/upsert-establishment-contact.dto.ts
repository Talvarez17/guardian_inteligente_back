import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsPositive, IsString, Matches } from "class-validator";

export class UpsertEstablishmentContactDto {

    @ApiProperty({ example: 1, description: 'Id del rol del contacto (client-roles)' })
    @IsInt()
    @IsPositive()
    contact_role_id: number;

    @ApiProperty({ example: 'Juan Pérez' })
    @IsString()
    contact_name: string;

    @ApiProperty({ example: '5512345678' })
    @IsString()
    @Matches(/^\d{10}$/, { message: 'Phone number must be 10 digits long' })
    contact_number: string;

    @ApiProperty({ example: 'contacto@ejemplo.com' })
    @IsEmail()
    contact_email: string;
}
