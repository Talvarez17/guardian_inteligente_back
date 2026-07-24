import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Query, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { TurnoverService } from './turnover.service';
import { CreateTurnoverDto } from './dto/create-turnover.dto';
import { UpdateTurnoverDto } from './dto/update-turnover.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('turnover')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('turnover')
export class TurnoverController {
  constructor(private readonly turnoverService: TurnoverService) { }

  @Post('/createTurnover')
  @ApiOperation({ summary: 'Create a new turnover (business activity type)' })
  @ApiResponse({ status: 201, description: 'Turnover successfully created' })
  @ApiResponse({ status: 409, description: 'Turnover already exists' })
  create(@Body() createTurnoverDto: CreateTurnoverDto) {
    return this.turnoverService.createTurnover(createTurnoverDto);
  }

  @Get('/getTurnovers')
  @ApiOperation({ summary: 'List all turnovers' })
  @ApiQuery({ name: 'onlyActive', required: false, type: Boolean, example: false })
  @ApiResponse({ status: 200, description: 'List of turnovers' })
  findAll(@Query('onlyActive', new DefaultValuePipe(false), ParseBoolPipe) onlyActive: boolean) {
    return this.turnoverService.findAllTurnovers(onlyActive);
  }

  @Get('/getOneTurnover/:id')
  @ApiOperation({ summary: 'Get a turnover by id' })
  @ApiParam({ name: 'id', description: 'Turnover ID' })
  @ApiResponse({ status: 200, description: 'Turnover found' })
  @ApiResponse({ status: 404, description: 'Turnover not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turnoverService.findOneTurnover(id);
  }

  @Patch('/updateTurnover/:id')
  @ApiOperation({ summary: 'Update a turnover' })
  @ApiParam({ name: 'id', description: 'Turnover ID' })
  @ApiResponse({ status: 200, description: 'Turnover successfully updated' })
  @ApiResponse({ status: 404, description: 'Turnover not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTurnoverDto: UpdateTurnoverDto) {
    return this.turnoverService.updateTurnover(id, updateTurnoverDto);
  }

  @Delete('/deleteTurnover/:id')
  @ApiOperation({ summary: 'Deactivate a turnover (soft delete)' })
  @ApiParam({ name: 'id', description: 'Turnover ID' })
  @ApiResponse({ status: 200, description: 'Turnover successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Turnover not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turnoverService.deleteTurnover(id);
  }
}
