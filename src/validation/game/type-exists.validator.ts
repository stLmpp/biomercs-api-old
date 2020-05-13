import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { TypeService } from '../../game/type/type.service';

@Injectable()
@ValidatorConstraint({ name: 'TypeExists', async: true })
export class TypeExistsValidator implements ValidatorConstraintInterface {
  constructor(private typeService: TypeService) {}

  async validate(
    idType: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.typeService.exists(idType);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Type doesn't exist`;
  }
}

export function TypeExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'TypeExists',
      validator: TypeExistsValidator,
      async: true,
    });
  };
}
