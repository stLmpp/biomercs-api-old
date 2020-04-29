import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CustomValidationArguments } from '../../util/types';
import { UserService } from '../../auth/user/user.service';
import { Injectable } from '@nestjs/common';
import { ReferenceTypeEnum } from '../../shared/types/reference-type.enum';
import { ReferenceTypeInterface } from '../../shared/types/reference-type.interface';
import { ScoreService } from '../../score/score.service';

@ValidatorConstraint({ name: 'idReferenceExists', async: true })
@Injectable()
export class IdReferenceExistsValidator<T extends ReferenceTypeInterface>
  implements ValidatorConstraintInterface {
  constructor(
    private userService: UserService,
    private scoreService: ScoreService
  ) {}

  async validate(
    idReference: number,
    { object }: CustomValidationArguments<T>
  ): Promise<boolean> {
    switch (object.type) {
      case ReferenceTypeEnum.user:
        return await this.userService.exists(idReference);
      case ReferenceTypeEnum.score:
        return await this.scoreService.exists(idReference);
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
