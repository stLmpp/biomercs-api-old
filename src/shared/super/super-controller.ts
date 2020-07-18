import { allColumns, CommonColumns } from './common-columns';
import { SuperService } from './super-service';
import {
  Body,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { CreatedByPipe } from '../pipes/created-by.pipe';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { UpdatedByPipe } from '../pipes/updated-by.pipe';
import { DecoratorFn, DeleteResult } from '../../util/types';
import { FindConditions } from 'typeorm';
import { FileUpload } from '../../file-upload/file-upload.entity';
import { FileType } from '../../file-upload/file-type.interface';
import { GetUser } from '../../auth/get-user.decorator';
import { User } from '../../auth/user/user.entity';
import { UseFileUpload } from '../../file-upload/file-upload.decorator';
import { ApplyIf } from '../decorator/apply-if.decorator';
import { CheckParamsPipe } from '../pipes/check-params.pipe';
import { RoleEnum } from '../../auth/role/role.enum';
import { isArray } from 'is-what';
import { Roles } from '../../auth/role/role.guard';
import { RouteParamEnum } from '../types/route-enums';

export interface ISuperController<
  Entity extends CommonColumns = any,
  AddDto = any,
  UpdateDto = any
> {
  add: (dto: AddDto) => Promise<Entity>;
  addMany: (dto: AddDto[]) => Promise<Entity[]>;
  exists: (dto: FindConditions<Entity>) => Promise<boolean>;
  findByParams: (
    dto: FindConditions<Entity>,
    limit?: number
  ) => Promise<Entity[]>;
  findOneByParams: (dto: FindConditions<Entity>) => Promise<Entity>;
  update: (id: number, dto: UpdateDto) => Promise<Entity>;
  fileUpload: (id: number, file: FileType, user: User) => Promise<FileUpload>;
  delete: (id: number) => Promise<Entity[]>;
  findAll: () => Promise<Entity[]>;
  search: (term: string) => Promise<Entity[]>;
  findById: (id: number) => Promise<Entity>;
  countByParams: (dto: FindConditions<Entity>) => Promise<number>;
  updateOrder: (ids: number[]) => Promise<void>;
}

export class SuperControllerRole {
  constructor(partial?: Partial<SuperControllerRole>) {
    Object.assign(this, partial);
  }

  persist?: RoleEnum[] = [];
  find?: RoleEnum[] = [];
  add?: RoleEnum[] = [];
  addMany?: RoleEnum[] = [];
  exists?: RoleEnum[] = [];
  findByParams?: RoleEnum[] = [];
  findOneByParams?: RoleEnum[] = [];
  update?: RoleEnum[] = [];
  fileUpload?: RoleEnum[] = [];
  delete?: RoleEnum[] = [];
  findAll?: RoleEnum[] = [];
  search?: RoleEnum[] = [];
  findById?: RoleEnum[] = [];
  countByParams?: RoleEnum[] = [];
  updateOrder?: RoleEnum[] = [];
}

export interface SuperControllerOptions<
  Entity extends CommonColumns = any,
  AddDto = any,
  UpdateDto = any
> {
  entity: { new (): Entity };
  dto?: SuperControllerOptionsDto<Entity, AddDto, UpdateDto>;
  searchBy?: (keyof Entity)[];
  idKey?: string;
  relations?: (keyof Entity)[] | string[];
  fileUpload?: SuperControllerOptionsFileUpload;
  excludeMethods?: ('add' | 'addMany' | 'delete' | 'findAll' | 'findById')[];
  roles?: RoleEnum[] | SuperControllerRole;
}

export interface SuperControllerOptionsDto<
  Entity extends CommonColumns = any,
  AddDto = any,
  UpdateDto = any
> {
  add?: { new (): AddDto };
  update?: { new (): UpdateDto };
  params?: { new (): FindConditions<Entity> };
  exists?: { new (): FindConditions<Entity> };
  delete?: { new (): FindConditions<Entity> };
  count?: { new (): FindConditions<Entity> };
}

export interface SuperControllerOptionsFileUpload {
  filesAllowed?: string[];
}

export const ROLE_METADATA: Partial<Record<
  keyof ISuperController,
  'persist' | 'find'
>> = {
  update: 'persist',
  add: 'persist',
  addMany: 'persist',
  delete: 'persist',
  exists: 'find',
  fileUpload: 'persist',
  findAll: 'find',
  findById: 'find',
  findByParams: 'find',
  findOneByParams: 'find',
  search: 'find',
  countByParams: 'find',
  updateOrder: 'persist',
};

export function SuperController<
  Entity extends CommonColumns,
  AddDto = any,
  UpdateDto = any
>(
  options: SuperControllerOptions<Entity, AddDto, UpdateDto>
): { new (service: SuperService<Entity, AddDto, UpdateDto>) } {
  options = {
    ...{ idKey: 'id', excludeMethods: [] },
    ...options,
  };
  const {
    fileUpload,
    idKey,
    relations,
    entity,
    dto: _dto,
    searchBy,
    excludeMethods,
    roles,
  } = options;

  function ApplyRoles(): DecoratorFn {
    return (target, propertyName, propertyDescriptor) => {
      if (roles) {
        if (isArray(roles)) {
          Roles(...roles)(target, propertyName, propertyDescriptor);
        } else if (roles instanceof SuperControllerRole) {
          const applyRoles = roles[ROLE_METADATA[propertyName]];
          const specificMethod = roles[propertyName];
          if (specificMethod?.length) {
            Roles(...specificMethod)(target, propertyName, propertyDescriptor);
          } else if (applyRoles?.length) {
            Roles(...applyRoles)(target, propertyName, propertyDescriptor);
          }
        }
      }
    };
  }

  const hasOrder = allColumns<any>(entity).includes('order');

  class SuperControllerClazz
    implements ISuperController<Entity, AddDto, UpdateDto> {
    constructor(private __service: SuperService<Entity, AddDto, UpdateDto>) {}

    @ApplyIf(!excludeMethods.includes('add') && !!_dto?.add, [
      Post(),
      ApiBody({ type: _dto?.add }),
      ApiCreatedResponse({ type: entity }),
    ])
    @ApplyRoles()
    add(@Body(CreatedByPipe) dto: AddDto): Promise<Entity> {
      return this.__service.add(dto, relations);
    }

    @ApplyIf(!excludeMethods.includes('addMany') && !!_dto?.add, [
      Post('batch'),
      ApiBody({ type: _dto?.add, isArray: true }),
      ApiCreatedResponse({ type: entity, isArray: true }),
    ])
    @ApplyRoles()
    addMany(@Body(CreatedByPipe) dto: AddDto[]): Promise<Entity[]> {
      return this.__service.addMany(dto, relations);
    }

    @ApplyIf(!!_dto?.exists, [
      Post('exists'),
      HttpCode(200),
      ApiBody({ type: _dto?.exists }),
      ApiOkResponse({ type: Boolean }),
    ])
    @ApplyRoles()
    exists(
      @Body(CheckParamsPipe) dto: FindConditions<Entity>
    ): Promise<boolean> {
      return this.__service.exists(dto);
    }

    @ApplyIf(!!_dto?.params, [
      Post('params'),
      HttpCode(200),
      ApiOkResponse({ type: entity, isArray: true }),
      ApiBody({ type: _dto?.params }),
      ApiQuery({ name: RouteParamEnum.limit, type: Number, required: false }),
    ])
    @ApplyRoles()
    findByParams(
      @Body(CheckParamsPipe) dto: FindConditions<Entity>,
      @Query(RouteParamEnum.limit) limit?: number
    ): Promise<Entity[]> {
      return this.__service.findByParams(dto, relations ?? [], limit);
    }

    @ApplyIf(!!_dto?.params, [
      Post('one-params'),
      HttpCode(200),
      ApiOkResponse({ type: entity }),
      ApiBody({ type: _dto?.params }),
    ])
    @ApplyRoles()
    findOneByParams(
      @Body(CheckParamsPipe) dto: FindConditions<Entity>
    ): Promise<Entity> {
      return this.__service.findOneByParams(dto);
    }

    @ApplyIf(!!_dto?.count, [
      Post('count'),
      HttpCode(200),
      ApiOkResponse({ type: Number }),
      ApiBody({ type: _dto?.count }),
    ])
    @ApplyRoles()
    countByParams(
      @Body(CheckParamsPipe) dto: FindConditions<Entity>
    ): Promise<number> {
      return this.__service.countByParams(dto);
    }

    @ApplyIf(hasOrder, [
      Post('order'),
      ApiBody({ type: Number, isArray: true }),
      HttpCode(200),
    ])
    @ApplyRoles()
    updateOrder(@Body() order: number[]): Promise<void> {
      return this.__service.updateOrder(order);
    }

    @ApplyIf(!!_dto?.update, [
      Patch(`:${idKey}`),
      ApiBody({ type: _dto?.update }),
      ApiOkResponse({ type: entity }),
    ])
    @ApplyRoles()
    update(
      @Param(idKey) id: number,
      @Body(UpdatedByPipe) dto: UpdateDto
    ): Promise<Entity> {
      return this.__service.update(id, dto, relations ?? []);
    }

    @ApplyIf(!!fileUpload, [
      Patch(`:${idKey}/file`),
      UseFileUpload({ filesAllowed: fileUpload?.filesAllowed }),
      ApiOkResponse(),
    ])
    @ApplyRoles()
    fileUpload(
      @Param(idKey) id: number,
      @UploadedFile('file') file: FileType,
      @GetUser() user: User
    ): Promise<FileUpload> {
      return this.__service.uploadFile(id, file, user);
    }

    @ApplyIf(!!_dto?.delete, [
      Delete(),
      ApiBody({ type: _dto.delete }),
      ApiOkResponse({ type: DeleteResult }),
    ])
    deleteParams(
      @Body(CheckParamsPipe) dto: FindConditions<Entity>
    ): Promise<Entity[]> {
      return this.__service.delete(dto);
    }

    @ApplyIf(!excludeMethods.includes('delete'), [
      Delete(`:${idKey}`),
      ApiOkResponse({ type: DeleteResult }),
    ])
    @ApplyRoles()
    delete(@Param(idKey) id: number): Promise<Entity[]> {
      return this.__service.delete(id);
    }

    @ApplyIf(!excludeMethods.includes('findAll'), [
      Get(),
      ApiOkResponse({ type: entity, isArray: true }),
    ])
    @ApplyRoles()
    findAll(): Promise<Entity[]> {
      return this.__service.findAll(relations ?? []);
    }

    @ApplyIf(!!searchBy?.length, [
      Get('search'),
      ApiOkResponse({ type: entity }),
    ])
    @ApplyRoles()
    search(@Query(RouteParamEnum.term) term: string): Promise<Entity[]> {
      return this.__service.search(term, searchBy, relations ?? []);
    }

    @ApplyIf(!excludeMethods.includes('findById'), [
      Get(`:${idKey}`),
      ApiOkResponse({ type: entity }),
    ])
    @ApplyRoles()
    findById(@Param(idKey) id: number): Promise<Entity> {
      return this.__service.findById(id, relations ?? []);
    }
  }

  return SuperControllerClazz;
}
