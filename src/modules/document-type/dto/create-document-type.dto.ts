import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from "class-validator";

export class CreateDocumentTypeDto {

    @ApiProperty({ example: 'Contrato' })
    @IsString()
    name:string;

    @ApiProperty({ example: 1, description: 'Id of the documental area this type belongs to' })
    @IsNumber()
    category_id:number;

    @ApiProperty({ example: 12, description: 'Validity of the document, in months' })
    @IsNumber()
    validity:number;

}
