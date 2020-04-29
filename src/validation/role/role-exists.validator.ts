import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { RoleService } from '../../auth/role/role.service';

@Injectable()
@ValidatorConstraint({ name: 'RoleExists', async: true })
export class RoleExistsValidator implements ValidatorConstraintInterface {
  constructor(private roleService: RoleService) {}

  async validate(
    idRole: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.roleService.exists(idRole);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Role doesn't exist`;
  }
}

export function RoleExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'RoleExists',
      validator: RoleExistsValidator,
      async: true,
    });
  };
}
