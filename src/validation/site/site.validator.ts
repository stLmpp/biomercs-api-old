import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SiteService } from '../../site/site.service';

@Injectable()
@ValidatorConstraint({ name: 'SiteExists', async: true })
export class SiteExistsValidator implements ValidatorConstraintInterface {
  constructor(private siteService: SiteService) {}

  async validate(
    idSite: number,
    validationArgs: ValidationArguments
  ): Promise<boolean> {
    return await this.siteService.exists(idSite);
  }

  defaultMessage(validationArgumentos: ValidationArguments): string {
    return `Site doesn't exist`;
  }
}

export function SiteExists(options?: ValidationOptions): PropertyDecorator {
  return (target, propertyName: string) => {
    registerDecorator({
      target: target.constructor,
      propertyName,
      options,
      constraints: [],
      name: 'SiteExists',
      validator: SiteExistsValidator,
      async: true,
    });
  };
}
