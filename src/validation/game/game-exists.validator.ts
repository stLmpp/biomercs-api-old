import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { GameService } from '../../game/game.service';

@Injectable()
@ValidatorConstraint({ name: 'GameExists', async: true })
export class GameExistsValidator implements ValidatorConstraintInterface {
  constructor(private gameService: GameService) {}

  async validate(
    idGame: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.gameService.exists(idGame);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Game doesn't exist`;
  }
}

export function GameExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'GameExists',
      validator: GameExistsValidator,
      async: true,
    });
  };
}
