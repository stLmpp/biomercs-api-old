import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CustomValidationArguments } from '../../util/types';
import { UserService } from '../../auth/user/user.service';
import { LikeTypeInterface } from '../../like/like-type.interface';
import { LikeTypeEnum } from '../../like/like-type.enum';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'idReferenceExists', async: true })
@Injectable()
export class IdReferenceExistsValidator<T extends LikeTypeInterface>
  implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(
    idReference: number,
    { object }: CustomValidationArguments<T>
  ): Promise<boolean> {
    switch (object.type) {
      case LikeTypeEnum.user:
        return await this.userService.exists(idReference);
      case LikeTypeEnum.score:
        return true; // TODO score exists
      default:
        return false;
    }
  }

  defaultMessage({ object }: CustomValidationArguments<T>): string {
    return `idReference of type "${object.type}" doesn't exist`;
  }
}

export function IdReferenceExists(
  options?: ValidationOptions
): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'idReferenceExists',
      validator: IdReferenceExistsValidator,
      async: true,
    });
  };
}
