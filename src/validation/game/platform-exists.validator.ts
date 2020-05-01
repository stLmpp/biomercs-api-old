import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PlatformService } from '../../game/platform/platform.service';

@Injectable()
@ValidatorConstraint({ name: 'PlatformExists', async: true })
export class PlatformExistsValidator implements ValidatorConstraintInterface {
  constructor(private platformService: PlatformService) {}

  async validate(
    idPlatform: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.platformService.exists(idPlatform);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Platform doesn't exist`;
  }
}

export function PlatformExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'PlatformExists',
      validator: PlatformExistsValidator,
      async: true,
    });
  };
}
