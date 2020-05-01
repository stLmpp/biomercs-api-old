import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ScorePlayerService } from '../../score/score-player/score-player.service';

@Injectable()
@ValidatorConstraint({ name: 'ScorePlayerExists', async: true })
export class ScorePlayerExistsValidator
  implements ValidatorConstraintInterface {
  constructor(private scorePlayerService: ScorePlayerService) {}

  async validate(
    idScorePlayer: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.scorePlayerService.exists(idScorePlayer);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `ScorePlayer doesn't exist`;
  }
}

export function ScorePlayerExists(
  options?: ValidationOptions
): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'ScorePlayerExists',
      validator: ScorePlayerExistsValidator,
      async: true,
    });
  };
}
