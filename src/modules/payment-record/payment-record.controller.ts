import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { PaymentRecordService } from './payment-record.service';
import { CreatePaymentRecordDto } from './dto/create-payment-record.dto';
import { UpdatePaymentRecordDto } from './dto/update-payment-record.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { ApiPaginatedQuery } from '../../common/decorators/api-paginated-query.decorator';

@ApiTags('payment-records')
@Controller('payment-records')
export class PaymentRecordController {
  constructor(private readonly paymentRecordService: PaymentRecordService) { }

  @Post('/createPaymentRecord')
  @ApiOperation({ summary: 'Register a new payment record for an establishment' })
  @ApiResponse({ status: 201, description: 'Payment record successfully created' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  create(@Body() createPaymentRecordDto: CreatePaymentRecordDto) {
    return this.paymentRecordService.createPaymentRecord(createPaymentRecordDto);
  }

  @Get('/getPaymentRecords/:establishmentId')
  @ApiOperation({ summary: 'List payment records for an establishment (paginated, sortable, searchable by folio)' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiPaginatedQuery()
  @ApiResponse({ status: 200, description: 'Paginated list of payment records' })
  findAll(@Param('establishmentId') establishmentId: string, @Query() query: PaginationQueryDto) {
    return this.paymentRecordService.findAllByEstablishment(establishmentId, query);
  }

  @Get('/getPaymentSummary/:establishmentId')
  @ApiOperation({ summary: 'Get the payment summary for an establishment (total paid and overdue balance)' })
  @ApiParam({ name: 'establishmentId', description: 'Establishment UUID' })
  @ApiResponse({ status: 200, description: 'Payment summary calculated' })
  @ApiResponse({ status: 404, description: 'Establishment not found' })
  getSummary(@Param('establishmentId') establishmentId: string) {
    return this.paymentRecordService.getSummary(establishmentId);
  }

  @Patch('/updatePaymentRecord/:id')
  @ApiOperation({ summary: 'Update a payment record' })
  @ApiParam({ name: 'id', description: 'Payment record id' })
  @ApiResponse({ status: 200, description: 'Payment record successfully updated' })
  @ApiResponse({ status: 404, description: 'Payment record not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePaymentRecordDto: UpdatePaymentRecordDto) {
    return this.paymentRecordService.updatePaymentRecord(id, updatePaymentRecordDto);
  }

  @Delete('/deletePaymentRecord/:id')
  @ApiOperation({ summary: 'Permanently delete a payment record' })
  @ApiParam({ name: 'id', description: 'Payment record id' })
  @ApiResponse({ status: 200, description: 'Payment record permanently deleted' })
  @ApiResponse({ status: 404, description: 'Payment record not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.paymentRecordService.deletePaymentRecord(id);
  }
}
