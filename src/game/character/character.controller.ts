import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { RouteParamEnum } from '../../shared/types/route-enums';
import { environment } from '../../shared/env/env';
import {
  SuperController,
  SuperControllerRole,
} from '../../shared/super/super-controller';
import {
  CharacterAddDto,
  CharacterExistsDto,
  CharacterParamsDto,
  CharacterUpdateDto,
} from './character.dto';

@ApiTags('Character')
@Auth()
@Controller('character')
export class CharacterController extends SuperController<Character>({
  entity: Character,
  dto: {
    add: CharacterAddDto,
    update: CharacterUpdateDto,
    params: CharacterParamsDto,
    exists: CharacterExistsDto,
  },
  idKey: RouteParamEnum.idCharacter,
  searchBy: ['name', 'shortName'],
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
  roles: new SuperControllerRole({
    persist: [RoleEnum.admin],
    find: [RoleEnum.user],
  }),
}) {
  constructor(private characterService: CharacterService) {
    super(characterService);
  }
}
