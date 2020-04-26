import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ModeService } from '../../game/mode/mode.service';

@Injectable()
@ValidatorConstraint({ name: 'ModeExists', async: true })
export class ModeExistsValidator implements ValidatorConstraintInterface {
  constructor(private modeService: ModeService) {}

  async validate(
    idMode: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.modeService.exists(idMode);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Mode doesn't exist`;
  }
}

export function ModeExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'ModeExists',
      validator: ModeExistsValidator,
      async: true,
    });
  };
}
