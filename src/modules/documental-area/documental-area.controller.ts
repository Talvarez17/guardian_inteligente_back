import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DocumentalAreaService } from './documental-area.service';
import { CreateDocumentalAreaDto } from './dto/create-documental-area.dto';
import { UpdateDocumentalAreaDto } from './dto/update-documental-area.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';

@ApiTags('documental-area')
@Controller('documental-area')
export class DocumentalAreaController {
  constructor(private readonly documentalAreaService: DocumentalAreaService) { }

  @Post('/createArea')
  @ApiOperation({ summary: 'Create a new documental area' })
  @ApiResponse({ status: 201, description: 'Documental area successfully created' })
  @ApiResponse({ status: 409, description: 'Documental area already exists' })
  create(@Body() createDocumentalAreaDto: CreateDocumentalAreaDto) {
    return this.documentalAreaService.createArea(createDocumentalAreaDto);
  }

  @Get('/getAreas')
  @ApiOperation({ summary: 'List all documental areas (paginated, sortable, searchable by area/description)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of documental areas' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.documentalAreaService.findAllAreas(query);
  }

  @Get('/getArea/:id')
  @ApiOperation({ summary: 'Get a documental area by id' })
  @ApiParam({ name: 'id', description: 'Documental area ID' })
  @ApiResponse({ status: 200, description: 'Documental area found' })
  @ApiResponse({ status: 404, description: 'Documental area not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentalAreaService.findOneArea(id);
  }

  @Patch('/updateArea/:id')
  @ApiOperation({ summary: 'Update a documental area' })
  @ApiParam({ name: 'id', description: 'Documental area ID' })
  @ApiResponse({ status: 200, description: 'Documental area successfully updated' })
  @ApiResponse({ status: 404, description: 'Documental area not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDocumentalAreaDto: UpdateDocumentalAreaDto) {
    return this.documentalAreaService.updateArea(id, updateDocumentalAreaDto);
  }

  @Delete('/deleteArea/:id')
  @ApiOperation({ summary: 'Deactivate a documental area (soft delete)' })
  @ApiParam({ name: 'id', description: 'Documental area ID' })
  @ApiResponse({ status: 200, description: 'Documental area successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Documental area not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentalAreaService.deleteArea(id);
  }
}
