import { Controller } from '@nestjs/common';
import { Auth } from '../../auth/auth.decorator';
import { Roles } from '../../auth/role/role.guard';
import { RoleEnum } from '../../auth/role/role.enum';
import { ApiTags } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { Character } from './character.entity';
import { RouteParamId } from '../../shared/types/route-enums';
import { environment } from '../../shared/env/env';
import { SuperController } from '../../shared/super/super-controller';
import {
  CharacterAddDto,
  CharacterExistsDto,
  CharacterParamsDto,
  CharacterUpdateDto,
} from './character.dto';

@ApiTags('Character')
@Roles(RoleEnum.admin)
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
  idKey: RouteParamId.idCharacter,
  searchBy: ['name', 'shortName'],
  fileUpload: {
    filesAllowed: environment.imageExtensionsAllowed,
  },
}) {
  constructor(private characterService: CharacterService) {
    super(characterService);
  }
}
