import { Controller, Get, Put, Body, Param, ParseIntPipe, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { EstablishmentChecklistItemService } from './establishment-checklist-item.service';
import { UpsertEstablishmentChecklistItemDto } from './dto/upsert-establishment-checklist-item.dto';

const checklistItemFileSchema = {
  type: 'object',
  properties: {
    completed: { type: 'boolean', example: true },
    file: { type: 'string', format: 'binary', description: 'Documento que respalda el ítem (opcional)' },
  },
};

@ApiTags('establishment-checklist-items')
@Controller('establishment-checklist-items')
export class EstablishmentChecklistItemController {
  constructor(private readonly establishmentChecklistItemService: EstablishmentChecklistItemService) { }

  @Get('/getEstablishmentChecklist/:establishmentId')
  @ApiOperation({ summary: 'Get the full operational checklist for an establishment (all item types with their status)' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Checklist retrieved' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  findAll(@Param('establishmentId') establishmentId: string) {
    return this.establishmentChecklistItemService.findChecklistForEstablishment(establishmentId);
  }

  @Put('/setEstablishmentChecklistItem/:establishmentId/:itemTypeId')
  @ApiOperation({ summary: 'Mark a checklist item as completed/pending, optionally attaching its backing document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { ...checklistItemFileSchema, required: ['completed'] } })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiParam({ name: 'itemTypeId', description: 'Checklist item type id' })
  @ApiResponse({ status: 200, description: 'Checklist item successfully saved' })
  @ApiResponse({ status: 404, description: 'Establishment or checklist item type not found' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  upsert(
    @Param('establishmentId') establishmentId: string,
    @Param('itemTypeId', ParseIntPipe) itemTypeId: number,
    @Body() dto: UpsertEstablishmentChecklistItemDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.establishmentChecklistItemService.upsertChecklistItem(establishmentId, itemTypeId, dto, file);
  }
}
