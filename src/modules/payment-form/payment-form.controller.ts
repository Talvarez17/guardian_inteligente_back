import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaymentFormService } from './payment-form.service';
import { CreatePaymentFormDto } from './dto/create-payment-form.dto';
import { UpdatePaymentFormDto } from './dto/update-payment-form.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';

@ApiTags('payment-forms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-forms')
export class PaymentFormController {
  constructor(private readonly paymentFormService: PaymentFormService) { }

  @Post('/createPaymentForm')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new payment form (admin only)' })
  @ApiResponse({ status: 201, description: 'Payment form successfully created' })
  @ApiResponse({ status: 409, description: 'Payment form already exists' })
  create(@Body() createPaymentFormDto: CreatePaymentFormDto) {
    return this.paymentFormService.createPaymentForm(createPaymentFormDto);
  }

  @Get('/getPaymentForms')
  @ApiOperation({ summary: 'List all payment forms (paginated, sortable, searchable by name)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of payment forms' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.paymentFormService.findAllPaymentForms(query);
  }

  @Get('/getPaymentForm/:id')
  @ApiOperation({ summary: 'Get a payment form by id' })
  @ApiParam({ name: 'id', description: 'Payment form id' })
  @ApiResponse({ status: 200, description: 'Payment form found' })
  @ApiResponse({ status: 404, description: 'Payment form not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentFormService.findOnePaymentForm(id);
  }

  @Patch('/updatePaymentForm/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Update a payment form (admin only)' })
  @ApiParam({ name: 'id', description: 'Payment form id' })
  @ApiResponse({ status: 200, description: 'Payment form successfully updated' })
  @ApiResponse({ status: 404, description: 'Payment form not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentFormDto: UpdatePaymentFormDto) {
    return this.paymentFormService.updatePaymentForm(id, updatePaymentFormDto);
  }

  @Delete('/deletePaymentForm/:id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Deactivate a payment form (admin only, soft delete)' })
  @ApiParam({ name: 'id', description: 'Payment form id' })
  @ApiResponse({ status: 200, description: 'Payment form successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Payment form not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentFormService.deletePaymentForm(id);
  }
}
