import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {

    @ApiPropertyOptional({ example: true, description: 'Activa o desactiva el registro' })
    @IsOptional()
    @IsBoolean()
    status?: boolean;
}
