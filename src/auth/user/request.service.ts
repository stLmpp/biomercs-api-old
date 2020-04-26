import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from './user.entity';

export interface MyRequest extends Request {
  user: User;
}

@Injectable({ scope: Scope.REQUEST })
export class RequestService {
  constructor(@Inject(REQUEST) private request: MyRequest) {}

  get user(): User {
    return this.request.user ?? ({ id: -1 } as User);
  }
}
