import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EstablishmentContactService } from './establishment-contact.service';
import { UpsertEstablishmentContactDto } from './dto/upsert-establishment-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('establishment-contacts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('establishment-contacts')
export class EstablishmentContactController {
  constructor(private readonly establishmentContactService: EstablishmentContactService) { }

  @Put('/setEstablishmentContact/:establishmentId')
  @ApiOperation({ summary: 'Create or replace the contact info for an establishment' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment contact successfully saved' })
  @ApiResponse({ status: 404, description: 'Establishment or client role not found' })
  upsert(@Param('establishmentId') establishmentId: string, @Body() dto: UpsertEstablishmentContactDto) {
    return this.establishmentContactService.upsertContact(establishmentId, dto);
  }

  @Get('/getEstablishmentContact/:establishmentId')
  @ApiOperation({ summary: 'Get the contact info for an establishment' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment contact found' })
  @ApiResponse({ status: 404, description: 'Establishment contact not found' })
  findOne(@Param('establishmentId') establishmentId: string) {
    return this.establishmentContactService.findByEstablishment(establishmentId);
  }
}
