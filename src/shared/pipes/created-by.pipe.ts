import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { UserService } from '../../auth/user/user.service';
import { isAnyObject, isArray } from 'is-what';

@Injectable()
export class CreatedByPipe implements PipeTransform {
  constructor(private userService: UserService) {}

  transform(value: any, { type }: ArgumentMetadata): any {
    if (!value || type !== 'body') return value;
    if (isArray(value)) {
      value = value.map(val => {
        val.createdBy = this.userService.user.id;
        return val;
      });
    } else if (isAnyObject(value)) {
      value.createdBy = this.userService.user.id;
    }
    return value;
  }
}
