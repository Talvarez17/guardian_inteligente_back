import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiPaginatedQuery() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: Number, example: 1 }),
    ApiQuery({ name: 'limit', required: false, type: Number, example: 10 }),
    ApiQuery({ name: 'sortBy', required: false, type: String }),
    ApiQuery({ name: 'order', required: false, enum: ['ASC', 'DESC'] }),
    ApiQuery({ name: 'search', required: false, type: String }),
    ApiQuery({ name: 'onlyActive', required: false, type: Boolean, example: false }),
  );
}
