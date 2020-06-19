import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsGreaterThanValidator', async: false })
export class IsGreaterThanValidator implements ValidatorConstraintInterface {
  validate(value: any, validationArgs: ValidationArguments): boolean {
    return value > validationArgs.object[validationArgs.constraints[0]];
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `$property must be greater than $constraint1`;
  }
}

export function IsGreaterThan(
  property: string,
  options?: ValidationOptions
): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [property],
      name: 'IsGreaterThanValidator',
      validator: IsGreaterThanValidator,
      async: false,
    });
  };
}
