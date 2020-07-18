import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PlayerService } from '../../player/player.service';

@Injectable()
@ValidatorConstraint({ name: 'PlayerExists', async: true })
export class PlayerExistsValidator implements ValidatorConstraintInterface {
  constructor(private playerService: PlayerService) {}

  async validate(
    idPlayer: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.playerService.exists({ id: idPlayer });
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Player doesn't exist`;
  }
}

export function PlayerExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'PlayerExists',
      validator: PlayerExistsValidator,
      async: true,
    });
  };
}
