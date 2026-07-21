import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EstablishmentOperationService } from './establishment-operation.service';
import { UpsertEstablishmentOperationDto } from './dto/upsert-establishment-operation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('establishment-operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('establishment-operations')
export class EstablishmentOperationController {
  constructor(private readonly establishmentOperationService: EstablishmentOperationService) { }

  @Put('/setEstablishmentOperation/:establishmentId')
  @ApiOperation({ summary: 'Create or replace the operational risk/status data for an establishment' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment operation data successfully saved' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  upsert(@Param('establishmentId') establishmentId: string, @Body() dto: UpsertEstablishmentOperationDto) {
    return this.establishmentOperationService.upsertOperation(establishmentId, dto);
  }

  @Get('/getEstablishmentOperation/:establishmentId')
  @ApiOperation({ summary: 'Get the operational risk/status data for an establishment' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment operation data found' })
  @ApiResponse({ status: 404, description: 'Establishment operation data not found' })
  findOne(@Param('establishmentId') establishmentId: string) {
    return this.establishmentOperationService.findByEstablishment(establishmentId);
  }
}
