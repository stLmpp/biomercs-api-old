import { environment } from '../shared/env/env';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

export function Auth(): any {
  const decorators = environment.config('USE_AUTH')
    ? [
        UseGuards(AuthGuard()),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
      ]
    : [];
  return applyDecorators(...decorators);
}
