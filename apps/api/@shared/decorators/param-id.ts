import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const ParamId = createParamDecorator(
  (_data: string, context: ExecutionContext) => {
    ApiProperty({ type: Number });
    const id = Number(context.switchToHttp().getRequest().params.id);
    return id;
  },
);
