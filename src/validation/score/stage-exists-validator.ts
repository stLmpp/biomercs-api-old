import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { StageService } from '../../game/stage/stage.service';

@Injectable()
@ValidatorConstraint({ name: 'StageExists', async: true })
export class StageExistsValidator implements ValidatorConstraintInterface {
  constructor(private stageService: StageService) {}

  async validate(
    idStage: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.stageService.exists(idStage);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Stage doesn't exist`;
  }
}

export function StageExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'StageExists',
      validator: StageExistsValidator,
      async: true,
    });
  };
}
