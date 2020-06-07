import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ReasonService } from '../../report/reason/reason.service';

@Injectable()
@ValidatorConstraint({ name: 'ReasonExists', async: true })
export class ReasonExistsValidator implements ValidatorConstraintInterface {
  constructor(private reasonService: ReasonService) {}

  async validate(
    idReason: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.reasonService.exists(idReason);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Reason doesn't exist`;
  }
}

export function ReasonExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'ReasonExists',
      validator: ReasonExistsValidator,
      async: true,
    });
  };
}
