import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

//Con esta declaracion omiticion el password
export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {

}
