import {
  ArgumentMetadata,
  BadRequestException,
  Inject,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common';
import { isObjectEmpty, removeNullObject } from '../../util/util';
import { isAnyObject } from 'is-what';

export const CHECK_PARAMS_DEFAULT = 'CheckParamsDefault';

@Injectable()
export class CheckParamsPipe implements PipeTransform {
  constructor(
    @Optional() @Inject(CHECK_PARAMS_DEFAULT) private clearValues: boolean
  ) {}

  transform(value: unknown, metadata: ArgumentMetadata): any {
    value = this.clearValues ? removeNullObject(value) : value;
    if (isAnyObject(value) && isObjectEmpty(value)) {
      throw new BadRequestException('At least one parameter is required');
    } else {
      return value;
    }
  }
}
