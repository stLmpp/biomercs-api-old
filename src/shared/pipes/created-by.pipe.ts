import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { isAnyObject, isArray } from 'is-what';
import { RequestService } from '../../auth/user/request.service';

@Injectable()
export class CreatedByPipe implements PipeTransform {
  constructor(private requestService: RequestService) {}

  transform(value: any, { type }: ArgumentMetadata): any {
    if (!value || type !== 'body') return value;
    if (isArray(value)) {
      value = value.map(val => {
        val.createdBy = this.requestService.user.id;
        return val;
      });
    } else if (isAnyObject(value)) {
      value.createdBy = this.requestService.user.id;
    }
    return value;
  }
}
