import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '../../auth/user/user.service';
import { isAnyObject, isArray } from 'is-what';

@Injectable()
export class UpdatedByPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  transform(value: any, { type }: ArgumentMetadata): any {
    if (!value || type !== 'body') return value;
    if (isArray(value)) {
      return value.map(val => {
        val.lastUpdatedBy = this.userService.user.id;
        return val;
      });
    } else if (isAnyObject(value)) {
      value.lastUpdatedBy = this.userService.user.id;
    }
    return value;
  }
}
