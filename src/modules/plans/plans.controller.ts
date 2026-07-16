import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) { }

  @Post('/createPlan')
  @ApiOperation({ summary: 'Create a new plan' })
  @ApiResponse({ status: 201, description: 'Plan successfully created' })
  @ApiResponse({ status: 404, description: 'One or more features do not exist' })
  @ApiResponse({ status: 409, description: 'Plan already exists' })
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.createPlan(createPlanDto);
  }

  @Get('/getPlans')
  @ApiOperation({ summary: 'List all plans' })
  @ApiResponse({ status: 200, description: 'List of plans' })
  findAll() {
    return this.plansService.findAllPlans();
  }

  @Get('/getOnePlan/:id')
  @ApiOperation({ summary: 'Get a plan by id' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiResponse({ status: 200, description: 'Plan found' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.findOnePlan(id);
  }

  @Patch('/updatePlan/:id')
  @ApiOperation({ summary: 'Update a plan (only name, trial, comments and features are editable)' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiResponse({ status: 200, description: 'Plan successfully updated' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.updatePlan(id, updatePlanDto);
  }

  @Delete('/deletePlan/:id')
  @ApiOperation({ summary: 'Deactivate a plan (soft delete)' })
  @ApiParam({ name: 'id', description: 'Plan ID' })
  @ApiResponse({ status: 200, description: 'Plan successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Plan not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.plansService.deletePlan(id);
  }
}
