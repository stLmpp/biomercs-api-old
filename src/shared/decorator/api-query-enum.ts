import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiQueryOptions } from '@nestjs/swagger';
import { isNumber, isString } from 'is-what';

export function ApiQueryEnum(options: ApiQueryOptions): MethodDecorator {
  const enumValues = Object.values((options as any).enum).filter(isNumber);
  const enumLabels = Object.values((options as any).enum).filter(isString);
  const description = enumLabels
    .reduce(
      (acc, key) => [...acc, `${(options as any).enum[key]} = ${key}`],
      []
    )
    .join('<br>');
  return applyDecorators(
    ApiQuery({
      ...options,
      description,
      enum: enumValues,
    })
  );
}
