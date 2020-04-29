import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CharacterService } from '../../game/character/character.service';

@Injectable()
@ValidatorConstraint({ name: 'CharacterExists', async: true })
export class CharacterExistsValidator implements ValidatorConstraintInterface {
  constructor(private characterService: CharacterService) {}

  async validate(
    idCharacter: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.characterService.exists(idCharacter);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Character doesn't exist`;
  }
}

export function CharacterExists(
  options?: ValidationOptions
): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'CharacterExists',
      validator: CharacterExistsValidator,
      async: true,
    });
  };
}
