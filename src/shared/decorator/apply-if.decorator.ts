import { applyDecorators } from '@nestjs/common';

export const ApplyIf = (
  condition: boolean,
  decorators: any[]
): MethodDecorator => {
  decorators = condition ? decorators : [];
  return applyDecorators(...decorators);
};
