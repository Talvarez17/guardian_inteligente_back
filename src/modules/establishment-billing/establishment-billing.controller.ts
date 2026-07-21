import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EstablishmentBillingService } from './establishment-billing.service';
import { UpsertEstablishmentBillingDto } from './dto/upsert-establishment-billing.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('establishment-billing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('establishment-billing')
export class EstablishmentBillingController {
  constructor(private readonly establishmentBillingService: EstablishmentBillingService) { }

  @Put('/setEstablishmentBilling/:establishmentId')
  @ApiOperation({ summary: 'Create or replace the billing info for an establishment' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment billing info successfully saved' })
  @ApiResponse({ status: 404, description: 'Establishment, payment method or payment form not found' })
  upsert(@Param('establishmentId') establishmentId: string, @Body() dto: UpsertEstablishmentBillingDto) {
    return this.establishmentBillingService.upsertBilling(establishmentId, dto);
  }

  @Get('/getEstablishmentBilling/:establishmentId')
  @ApiOperation({ summary: 'Get the billing info for an establishment' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment billing info found' })
  @ApiResponse({ status: 404, description: 'Establishment billing info not found' })
  findOne(@Param('establishmentId') establishmentId: string) {
    return this.establishmentBillingService.findByEstablishment(establishmentId);
  }
}
