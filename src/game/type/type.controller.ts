import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { TypeService } from './type.service';
import { RouteParamId } from '../../shared/types/route-enums';
import { Type } from './type.entity';
import {
  TypeAddDto,
  TypeExistsDto,
  TypeParamsDto,
  TypeUpdateDto,
} from './type.dto';
import { SuperController } from '../../shared/super/super-controller';

@ApiTags('Type')
@Roles(RoleEnum.admin)
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
  idKey: RouteParamId.idType,
  searchBy: ['name'],
}) {
  constructor(private typeService: TypeService) {
    super(typeService);
  }
}
