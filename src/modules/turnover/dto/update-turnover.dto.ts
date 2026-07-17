import { PartialType } from '@nestjs/swagger';
import { CreateTurnoverDto } from './create-turnover.dto';

export class UpdateTurnoverDto extends PartialType(CreateTurnoverDto) {}
