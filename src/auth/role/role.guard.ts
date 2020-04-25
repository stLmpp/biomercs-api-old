import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { RoleEnum } from './role.enum';
import { getUserFromContext } from '../get-user.decorator';
import { getEnvVar } from '../../util/env';
import { ApiForbiddenResponse } from '@nestjs/swagger';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: RoleEnum[]) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const user = getUserFromContext(context);
    const userRoles = user?.userRoles?.map(userRole => userRole.role.name);
    if (!userRoles?.some(userRole => this.roles.includes(userRole))) {
      throw new ForbiddenException('Access denied');
    } else {
      return true;
    }
  }
}

export const Roles = (...roles: RoleEnum[]): any => {
  const decorators = getEnvVar('CONFIG_USE_ROLE')
    ? [
        UseGuards(new RoleGuard(roles)),
        ApiForbiddenResponse({ description: 'Access denied' }),
      ]
    : [];
  return applyDecorators(...decorators);
};
