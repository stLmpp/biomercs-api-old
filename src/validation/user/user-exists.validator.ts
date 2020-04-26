import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from '../../auth/user/user.service';

@Injectable()
@ValidatorConstraint({ name: 'userExists', async: true })
export class UserExistsValidator implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(idUser: number, a): Promise<boolean> {
    return await this.userService.exists(idUser);
  }

  defaultMessage(): string {
    return `User doesn't exist`;
  }
}

export function UserExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'userExists',
      validator: UserExistsValidator,
      async: true,
    });
  };
}
