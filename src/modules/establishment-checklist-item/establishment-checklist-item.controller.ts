import { Controller, Get, Put, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EstablishmentChecklistItemService } from './establishment-checklist-item.service';
import { UpsertEstablishmentChecklistItemDto } from './dto/upsert-establishment-checklist-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('establishment-checklist-items')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('establishment-checklist-items')
export class EstablishmentChecklistItemController {
  constructor(
    private readonly establishmentChecklistItemService: EstablishmentChecklistItemService,
  ) {}

  @Get('/getEstablishmentChecklist/:establishmentId')
  @ApiOperation({
    summary:
      'Get the full operational checklist for an establishment (all item types with their status)',
  })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Checklist retrieved' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  findAll(@Param('establishmentId') establishmentId: string) {
    return this.establishmentChecklistItemService.findChecklistForEstablishment(
      establishmentId,
    );
  }

  @Put('/setEstablishmentChecklistItem/:establishmentId/:itemTypeId')
  @ApiOperation({ summary: 'Mark a checklist item as completed/pending' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiParam({ name: 'itemTypeId', description: 'Checklist item type id' })
  @ApiResponse({
    status: 200,
    description: 'Checklist item successfully saved',
  })
  @ApiResponse({
    status: 404,
    description: 'Establishment or checklist item type not found',
  })
  upsert(
    @Param('establishmentId') establishmentId: string,
    @Param('itemTypeId', ParseIntPipe) itemTypeId: number,
    @Body() dto: UpsertEstablishmentChecklistItemDto,
  ) {
    return this.establishmentChecklistItemService.upsertChecklistItem(
      establishmentId,
      itemTypeId,
      dto,
    );
  }
}
