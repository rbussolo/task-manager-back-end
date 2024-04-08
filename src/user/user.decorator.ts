import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUserPayload } from 'src/auth/auth.service';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUserPayload => {
    const request = ctx.switchToHttp().getRequest();
    const user: IUserPayload = request.user;

    return user;
  },
);
