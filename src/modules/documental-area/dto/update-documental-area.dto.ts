import { PartialType } from '@nestjs/swagger';
import { CreateDocumentalAreaDto } from './create-documental-area.dto';

export class UpdateDocumentalAreaDto extends PartialType(CreateDocumentalAreaDto) {}
