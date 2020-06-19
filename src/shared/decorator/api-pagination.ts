import { ClassType } from 'class-transformer/ClassTransformer';
import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { Pagination } from 'nestjs-typeorm-paginate/index';
import {
  PaginationLinks,
  PaginationMeta,
} from '../view-model/pagination.view-model';

function paginateType(
  type: ClassType<any>,
  name?: string
): ClassType<Pagination<any>> {
  class Paginate implements Pagination<any> {
    @ApiProperty()
    links: PaginationLinks;

    @ApiProperty()
    meta: PaginationMeta;

    @ApiProperty({ type, isArray: true })
    items: any[];
  }
  name = name ?? `Pagination${type.name}`;
  Object.defineProperty(Paginate, 'name', { value: name });
  return Paginate;
}

export function ApiPagination(type: ClassType<any>): MethodDecorator {
  return applyDecorators(ApiOkResponse({ type: paginateType(type) }));
}
