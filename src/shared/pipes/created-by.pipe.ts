import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isAnyObject, isArray } from 'is-what';
import { RequestService } from '../../auth/user/request.service';
import { User } from '../../auth/user/user.entity';

export function updateCreatedBy<T>(value: T, user: User): T {
  if (!value) return value;
  if (isArray(value)) {
    return value.map(val => {
      (val as any).createdBy = user.id;
      return val;
    }) as any;
  } else if (isAnyObject(value)) {
    (value as any).createdBy = user.id;
  }
  return value;
}

@Injectable()
export class CreatedByPipe implements PipeTransform {
  constructor(private requestService: RequestService) {}

  transform(value: any, { type }: ArgumentMetadata): any {
    if (type !== 'body') return value;
    return updateCreatedBy(value, this.requestService.user);
  }
}
