import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const documentFileSchema = {
  type: 'object',
  properties: {
    file: { type: 'string', format: 'binary' },
    establishment_id: { type: 'string', example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' },
    name: { type: 'string', example: 'Política de privacidad' },
    area_id: { type: 'number', example: 1 },
    version: { type: 'string', example: 'v1' },
    expiration_date: { type: 'string', format: 'date', example: '2027-01-01' },
    comments: { type: 'string', example: 'Documento revisado por legal' },
  },
};

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) { }

  @Post('/createDocument')
  @ApiOperation({ summary: 'Upload a new document and create its record' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { ...documentFileSchema, required: ['file', 'establishment_id', 'name', 'area_id', 'version', 'expiration_date'] } })
  @ApiResponse({ status: 201, description: 'Document successfully created' })
  @ApiResponse({ status: 400, description: 'File is required' })
  @ApiResponse({ status: 404, description: 'Documental area not found' })
  @ApiResponse({ status: 409, description: 'Document already exists' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  create(@Body() createDocumentDto: CreateDocumentDto, @UploadedFile() file: Express.Multer.File) {
    return this.documentsService.createDocument(createDocumentDto, file);
  }

  @Get('/getDocuments')
  @ApiOperation({ summary: 'List all documents (paginated, sortable, searchable by name)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of documents' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.documentsService.findAllDocuments(query);
  }

  @Get('/getDocumentsByEstablishment/:establishmentId')
  @ApiOperation({ summary: 'List documents for an establishment (paginated, sortable, searchable by name)' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of documents for the establishment' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  findAllByEstablishment(@Param('establishmentId') establishmentId: string, @Query() query: PaginationQueryDto) {
    return this.documentsService.findAllByEstablishment(establishmentId, query);
  }

  @Get('/getOneDocument/:id')
  @ApiOperation({ summary: 'Get a document by id' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document found' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOneDocument(id);
  }

  @Patch('/updateDocument/:id')
  @ApiOperation({ summary: 'Update a document (optionally uploading a new file/version)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: documentFileSchema })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document successfully updated' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 10 * 1024 * 1024 } }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.documentsService.updateDocument(id, updateDocumentDto, file);
  }

  @Delete('/deleteDocument/:id')
  @ApiOperation({ summary: 'Deactivate a document (soft delete)' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.deleteDocument(id);
  }

  @Delete('/deleteDocumentPermanently/:id')
  @ApiOperation({ summary: 'Permanently delete a document (removes the database record and the file in DigitalOcean Spaces)' })
  @ApiParam({ name: 'id', description: 'Document ID' })
  @ApiResponse({ status: 200, description: 'Document permanently deleted' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  removePermanently(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.deleteDocumentPermanently(id);
  }
}
