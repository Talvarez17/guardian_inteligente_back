import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ChecklistItemTypeService } from './checklist-item-type.service';
import { CreateChecklistItemTypeDto } from './dto/create-checklist-item-type.dto';
import { UpdateChecklistItemTypeDto } from './dto/update-checklist-item-type.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';

@ApiTags('checklist-item-types')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('checklist-item-types')
export class ChecklistItemTypeController {
  constructor(private readonly checklistItemTypeService: ChecklistItemTypeService) { }

  @Post('/createChecklistItemType')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new checklist item type (admin only)' })
  @ApiResponse({ status: 201, description: 'Checklist item type successfully created' })
  @ApiResponse({ status: 409, description: 'Checklist item type already exists' })
  create(@Body() createChecklistItemTypeDto: CreateChecklistItemTypeDto) {
    return this.checklistItemTypeService.createChecklistItemType(createChecklistItemTypeDto);
  }

  @Get('/getChecklistItemTypes')
  @ApiOperation({ summary: 'List all checklist item types (paginated, sortable, searchable by name)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of checklist item types' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.checklistItemTypeService.findAllChecklistItemTypes(query);
  }

  @Get('/getChecklistItemType/:id')
  @ApiOperation({ summary: 'Get a checklist item type by id' })
  @ApiParam({ name: 'id', description: 'Checklist item type id' })
  @ApiResponse({ status: 200, description: 'Checklist item type found' })
  @ApiResponse({ status: 404, description: 'Checklist item type not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.checklistItemTypeService.findOneChecklistItemType(id);
  }

  @Patch('/updateChecklistItemType/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a checklist item type (admin only)' })
  @ApiParam({ name: 'id', description: 'Checklist item type id' })
  @ApiResponse({ status: 200, description: 'Checklist item type successfully updated' })
  @ApiResponse({ status: 404, description: 'Checklist item type not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateChecklistItemTypeDto: UpdateChecklistItemTypeDto) {
    return this.checklistItemTypeService.updateChecklistItemType(id, updateChecklistItemTypeDto);
  }

  @Delete('/deleteChecklistItemType/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Deactivate a checklist item type (admin only, soft delete)' })
  @ApiParam({ name: 'id', description: 'Checklist item type id' })
  @ApiResponse({ status: 200, description: 'Checklist item type successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Checklist item type not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.checklistItemTypeService.deleteChecklistItemType(id);
  }
}
