import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { GameModeService } from '../../game/game-mode/game-mode.service';

@Injectable()
@ValidatorConstraint({ name: 'GameModeExists', async: true })
export class GameModeExistsValidator implements ValidatorConstraintInterface {
  constructor(private gameModeService: GameModeService) {}

  async validate(
    idGameMode: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.gameModeService.exists(idGameMode);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `GameMode doesn't exist`;
  }
}

export function GameModeExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'GameModeExists',
      validator: GameModeExistsValidator,
      async: true,
    });
  };
}
