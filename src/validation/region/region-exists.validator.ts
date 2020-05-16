import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { RegionService } from '../../region/region.service';

@Injectable()
@ValidatorConstraint({ name: 'RegionExists', async: true })
export class RegionExistsValidator implements ValidatorConstraintInterface {
  constructor(private regionService: RegionService) {}

  async validate(
    idRegion: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.regionService.exists(idRegion);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Region doesn't exist`;
  }
}

export function RegionExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'RegionExists',
      validator: RegionExistsValidator,
      async: true,
    });
  };
}
