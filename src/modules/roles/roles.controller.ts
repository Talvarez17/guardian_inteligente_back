import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new role (admin only)' })
  @ApiResponse({ status: 201, description: 'Role successfully created' })
  @ApiResponse({ status: 409, description: 'Role already exists' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all roles (admin only)' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  findAll() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by id (admin only)' })
  @ApiParam({ name: 'id', description: 'Role id' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOneRole(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role (admin only)' })
  @ApiParam({ name: 'id', description: 'Role id' })
  @ApiResponse({ status: 200, description: 'Role successfully updated' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(+id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a role (admin only, soft delete)' })
  @ApiParam({ name: 'id', description: 'Role id' })
  @ApiResponse({ status: 200, description: 'Role successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id') id: string) {
    return this.rolesService.deleteRole(+id);
  }
}
