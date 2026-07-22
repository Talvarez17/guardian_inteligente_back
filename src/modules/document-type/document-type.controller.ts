import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { DocumentTypeService } from './document-type.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('document-type')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('document-type')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @Post('/createType')
  @ApiOperation({ summary: 'Create a new document type' })
  @ApiResponse({ status: 201, description: 'Document type successfully created' })
  @ApiResponse({ status: 409, description: 'Document type already exists' })
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypeService.createType(createDocumentTypeDto);
  }

  @Get('/getTypes')
  @ApiOperation({ summary: 'List all document types (paginated, sortable, searchable by name)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of document types' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.documentTypeService.findAll(query);
  }

  @Get('/getOneType/:id')
  @ApiOperation({ summary: 'Get a document type by id' })
  @ApiParam({ name: 'id', description: 'Document type ID' })
  @ApiResponse({ status: 200, description: 'Document type found' })
  @ApiResponse({ status: 404, description: 'Document type not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentTypeService.findOneType(id);
  }

  @Patch('/updateType/:id')
  @ApiOperation({ summary: 'Update a document type' })
  @ApiParam({ name: 'id', description: 'Document type ID' })
  @ApiResponse({ status: 200, description: 'Document type successfully updated' })
  @ApiResponse({ status: 404, description: 'Document type not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return this.documentTypeService.updateType(id, updateDocumentTypeDto);
  }

  @Delete('/deleteType/:id')
  @ApiOperation({ summary: 'Deactivate a document type (soft delete)' })
  @ApiParam({ name: 'id', description: 'Document type ID' })
  @ApiResponse({ status: 200, description: 'Document type successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Document type not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentTypeService.removeType(id);
  }
}
