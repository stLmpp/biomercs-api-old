import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isAnyObject, isArray, isNumber } from 'is-what';
import { RequestService } from '../../auth/user/request.service';
import { User } from '../../auth/user/user.entity';

export function updateLastUpdatedBy<T>(value: T, user: User | number = -1): T {
  if (!value) return value;
  const idUser = isNumber(user) ? user : user.id;
  if (isArray(value)) {
    return value.map(val => {
      (val as any).lastUpdatedBy = idUser;
      return val;
    }) as any;
  } else if (isAnyObject(value)) {
    (value as any).lastUpdatedBy = idUser;
  }
  return value;
}

@Injectable()
export class UpdatedByPipe implements PipeTransform {
  constructor(private requestService: RequestService) {}

  transform(value: any, { type }: ArgumentMetadata): any {
    if (type !== 'body') return value;
    return updateLastUpdatedBy(value, this.requestService.user);
  }
}
