import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { TypeService } from './type.service';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { Type } from './type.entity';
import {
  TypeAddDto,
  TypeExistsDto,
  TypeParamsDto,
  TypeUpdateDto,
} from './type.dto';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';

@ApiTags('Type')
@Auth()
@Controller('type')
export class TypeController extends SuperController<Type>({
  entity: Type,
  dto: {
    add: TypeAddDto,
    update: TypeUpdateDto,
    exists: TypeExistsDto,
    params: TypeParamsDto,
  },
  idKey: RouteParamEnum.idType,
  searchBy: ['name'],
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private typeService: TypeService) {
    super(typeService);
  }
}
