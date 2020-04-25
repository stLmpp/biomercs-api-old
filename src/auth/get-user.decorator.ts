import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user/user.entity';

export const getUserFromContext = (ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  if (user) {
    user.token = req.headers.authorization?.replace('Bearer ', '');
  }
  return user?.removePasswordAndSalt();
};

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User => {
    return getUserFromContext(ctx);
  }
);
