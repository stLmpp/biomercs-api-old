import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user/user.entity';
import { Player } from '../player/player.entity';
import { MyRequest } from './user/request.service';

export const getUserFromContext = (ctx: ExecutionContext): User => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  if (user) {
    user.token = req.headers.authorization?.replace('Bearer ', '');
  }
  return user ?? { id: -1 };
};

export const getPlayerFromContext = (ctx: ExecutionContext): Player => {
  const req: MyRequest = ctx.switchToHttp().getRequest();
  return req.user?.player;
};

export const GetUser = createParamDecorator(
  (data: any, ctx: ExecutionContext): User => getUserFromContext(ctx)
);

export const GetPlayer = createParamDecorator(
  (data: any, ctx: ExecutionContext): Player => getPlayerFromContext(ctx)
);
