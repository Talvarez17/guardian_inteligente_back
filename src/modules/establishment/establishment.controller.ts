import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { EstablishmentService } from './establishment.service';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('establishment')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('establishment')
export class EstablishmentController {
  constructor(private readonly establishmentService: EstablishmentService) { }

  @Post('/createEstablishment')
  @ApiOperation({ summary: 'Create a new establishment' })
  @ApiResponse({ status: 201, description: 'Establishment successfully created' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  @ApiResponse({ status: 409, description: 'Establishment already exists (rfc or email in use)' })
  create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
    return this.establishmentService.createEstablishment(createEstablishmentDto);
  }

  @Get('/getEstablishments')
  @ApiOperation({ summary: 'List all establishments (paginated, sortable, searchable by name/business_name/rfc/email/contact_name)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of establishments' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.establishmentService.findAllEstablishments(query);
  }

  @Get('/getOneEstablishment/:id')
  @ApiOperation({ summary: 'Get an establishment by id' })
  @ApiParam({ name: 'id', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment found' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  findOne(@Param('id') id: string) {
    return this.establishmentService.findOneEstablishment(id);
  }

  @Patch('/updateEstablishment/:id')
  @ApiOperation({ summary: 'Update an establishment' })
  @ApiParam({ name: 'id', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment successfully updated' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  update(@Param('id') id: string, @Body() updateEstablishmentDto: UpdateEstablishmentDto) {
    return this.establishmentService.updateEstablishment(id, updateEstablishmentDto);
  }

  @Delete('/deleteEstablishment/:id')
  @ApiOperation({ summary: 'Deactivate an establishment (soft delete)' })
  @ApiParam({ name: 'id', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Establishment successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  remove(@Param('id') id: string) {
    return this.establishmentService.deleteEstablishment(id);
  }
}
