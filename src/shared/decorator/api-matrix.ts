import { ClassType } from 'class-transformer/ClassTransformer';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { getSchemaPath } from '@nestjs/swagger';

export function matrixSchema(type: ClassType<any>): SchemaObject {
  return {
    type: 'array',
    items: {
      type: 'array',
      items: {
        $ref: getSchemaPath(type),
      },
    },
  };
}
