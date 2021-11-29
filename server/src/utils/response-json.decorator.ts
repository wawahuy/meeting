import { createParamDecorator, ExecutionContext, HttpStatus } from '@nestjs/common';

export type TResponseJson = (status: boolean) => (data: any) => void;

export const ResponseJson = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const res = ctx.switchToHttp().getResponse();
    return (status: boolean) => (data: any) => {
      res.status(HttpStatus.OK).json({
        status,
        data
      });
    };
  },
);