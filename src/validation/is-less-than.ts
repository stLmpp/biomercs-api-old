import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsLessThanValidator', async: false })
export class IsLessThanValidator implements ValidatorConstraintInterface {
  validate(value: any, validationArgs: ValidationArguments): boolean {
    return value > validationArgs.object[validationArgs.constraints[0]];
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `$property must be less than $constraint1`;
  }
}

export function IsLessThan(
  property: string,
  options?: ValidationOptions
): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [property],
      name: 'IsLessThanValidator',
      validator: IsLessThanValidator,
      async: false,
    });
  };
}
