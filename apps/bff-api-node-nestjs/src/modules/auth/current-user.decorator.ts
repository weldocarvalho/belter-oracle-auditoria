import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest, AuthenticatedUser } from './jwt-auth.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user) {
      throw new Error('CurrentUser decorator requires JwtAuthGuard.');
    }
    return request.user;
  },
);
