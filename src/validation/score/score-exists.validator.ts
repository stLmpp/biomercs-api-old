import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ScoreService } from '../../score/score.service';

@Injectable()
@ValidatorConstraint({ name: 'ScoreExists', async: true })
export class ScoreExistsValidator implements ValidatorConstraintInterface {
  constructor(private scoreService: ScoreService) {}

  async validate(
    idScore: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.scoreService.exists(idScore);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Score doesn't exist`;
  }
}

export function ScoreExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'ScoreExists',
      validator: ScoreExistsValidator,
      async: true,
    });
  };
}
