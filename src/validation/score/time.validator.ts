import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'TimeValid', async: true })
export class TimeValidator implements ValidatorConstraintInterface {
  validate(time: string, validationArgs: ValidationArguments): boolean {
    return /^\d{2,}'\d{2}"\d{2}$/.test(time);
  }

  defaultMessage(validationArguments: ValidationArguments): string {
    return `Time format is invalid`;
  }
}

export function ValidTime(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'TimeValid',
      validator: TimeValidator,
    });
  };
}
