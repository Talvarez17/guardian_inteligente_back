import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class CreateDocumentalAreaDto {

    @ApiProperty({ example: 'Legal' })
    @IsString()
    area: string;

    @ApiProperty({ example: 'Área encargada de la gestión documental legal' })
    @IsString()
    description: string;

    @ApiProperty({ example: '#FF5733' })
    @IsString()
    color: string;
}
