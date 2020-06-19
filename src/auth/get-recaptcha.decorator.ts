import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { environment } from '../shared/env/env';

export const RecaptchaToken = createParamDecorator(
  (data: any, ctx: ExecutionContext): string => {
    return ctx.switchToHttp().getRequest().headers[environment.reCaptchaToken];
  }
);
