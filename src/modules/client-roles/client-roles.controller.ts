import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ClientRolesService } from './client-roles.service';
import { CreateClientRoleDto } from './dto/create-client-role.dto';
import { UpdateClientRoleDto } from './dto/update-client-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';

@ApiTags('client-roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('client-roles')
export class ClientRolesController {
  constructor(private readonly clientRolesService: ClientRolesService) { }

  @Post('/createClientRole')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new client role (admin only)' })
  @ApiResponse({ status: 201, description: 'Client role successfully created' })
  @ApiResponse({ status: 409, description: 'Client role already exists' })
  create(@Body() createClientRoleDto: CreateClientRoleDto) {
    return this.clientRolesService.createClientRole(createClientRoleDto);
  }

  @Get('/getClientRoles')
  @ApiOperation({ summary: 'List all client roles (paginated, sortable, searchable by name)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of client roles' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.clientRolesService.findAllClientRoles(query);
  }

  @Get('/getClientRole/:id')
  @ApiOperation({ summary: 'Get a client role by id' })
  @ApiParam({ name: 'id', description: 'Client role id' })
  @ApiResponse({ status: 200, description: 'Client role found' })
  @ApiResponse({ status: 404, description: 'Client role not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientRolesService.findOneClientRole(id);
  }

  @Patch('/updateClientRole/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a client role (admin only)' })
  @ApiParam({ name: 'id', description: 'Client role id' })
  @ApiResponse({ status: 200, description: 'Client role successfully updated' })
  @ApiResponse({ status: 404, description: 'Client role not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateClientRoleDto: UpdateClientRoleDto) {
    return this.clientRolesService.updateClientRole(id, updateClientRoleDto);
  }

  @Delete('/deleteClientRole/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Deactivate a client role (admin only, soft delete)' })
  @ApiParam({ name: 'id', description: 'Client role id' })
  @ApiResponse({ status: 200, description: 'Client role successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Client role not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientRolesService.deleteClientRole(id);
  }
}
