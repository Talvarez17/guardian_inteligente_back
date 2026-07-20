import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';

@ApiTags('payment-methods')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('payment-methods')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) { }

  @Post('/createPaymentMethod')
  @ApiOperation({ summary: 'Create a new payment method (admin only)' })
  @ApiResponse({ status: 201, description: 'Payment method successfully created' })
  @ApiResponse({ status: 409, description: 'Payment method already exists' })
  create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    return this.paymentMethodService.createPaymentMethod(createPaymentMethodDto);
  }

  @Get('/getPaymentMethods')
  @ApiOperation({ summary: 'List all payment methods (admin only, paginated, sortable, searchable by name)' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of payment methods' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.paymentMethodService.findAllPaymentMethods(query);
  }

  @Get('/getPaymentMethod/:id')
  @ApiOperation({ summary: 'Get a payment method by id (admin only)' })
  @ApiParam({ name: 'id', description: 'Payment method id' })
  @ApiResponse({ status: 200, description: 'Payment method found' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.findOnePaymentMethod(id);
  }

  @Patch('/updatePaymentMethod/:id')
  @ApiOperation({ summary: 'Update a payment method (admin only)' })
  @ApiParam({ name: 'id', description: 'Payment method id' })
  @ApiResponse({ status: 200, description: 'Payment method successfully updated' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return this.paymentMethodService.updatePaymentMethod(id, updatePaymentMethodDto);
  }

  @Delete('/deletePaymentMethod/:id')
  @ApiOperation({ summary: 'Deactivate a payment method (admin only, soft delete)' })
  @ApiParam({ name: 'id', description: 'Payment method id' })
  @ApiResponse({ status: 200, description: 'Payment method successfully deactivated' })
  @ApiResponse({ status: 404, description: 'Payment method not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentMethodService.deletePaymentMethod(id);
  }
}
