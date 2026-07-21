import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PlanFeatureService } from './plan-feature.service';
import { CreatePlanFeatureDto } from './dto/create-plan-feature.dto';
import { UpdatePlanFeatureDto } from './dto/update-plan-feature.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('plan-feature')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('plan-feature')
export class PlanFeatureController {
  constructor(private readonly planFeatureService: PlanFeatureService) {}

  @Post('/createFeature')
  @ApiOperation({ summary: 'Create a new plan feature' })
  @ApiResponse({ status: 201, description: 'Plan feature successfully created' })
  @ApiResponse({ status: 409, description: 'Plan feature already exists' })
  create(@Body() createPlanFeatureDto: CreatePlanFeatureDto) {
    return this.planFeatureService.createFeature(createPlanFeatureDto);
  }

  @Get('/getFeatures')
  @ApiOperation({ summary: 'List all plan features' })
  @ApiResponse({ status: 200, description: 'List of plan features' })
  findAll() {
    return this.planFeatureService.findAllFeatures();
  }

  @Get('/getOneFeature/:id')
  @ApiOperation({ summary: 'Get a plan feature by id' })
  @ApiParam({ name: 'id', description: 'Plan feature ID' })
  @ApiResponse({ status: 200, description: 'Plan feature found' })
  @ApiResponse({ status: 404, description: 'Plan feature not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.planFeatureService.findOneFeature(id);
  }

  @Patch('/updateFeature/:id')
  @ApiOperation({ summary: 'Update a plan feature' })
  @ApiParam({ name: 'id', description: 'Plan feature ID' })
  @ApiResponse({ status: 200, description: 'Plan feature successfully updated' })
  @ApiResponse({ status: 404, description: 'Plan feature not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanFeatureDto: UpdatePlanFeatureDto) {
    return this.planFeatureService.updateFeature(id, updatePlanFeatureDto);
  }

  @Delete('/deleteFeature/:id')
  @ApiOperation({ summary: 'Deactivate a plan feature (soft delete)' })
  @ApiParam({ name: 'id', description: 'Plan feature ID' })
  @ApiResponse({ status: 200, description: 'Plan feature successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Plan feature not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.planFeatureService.removeFeature(id);
  }
}
