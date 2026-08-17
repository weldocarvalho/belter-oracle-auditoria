import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers['authorization'];

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de acesso ausente.');
    }

    const token = authorization.slice(7);

    try {
      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException('Token de acesso inválido ou expirado.');
    }
  }
}
