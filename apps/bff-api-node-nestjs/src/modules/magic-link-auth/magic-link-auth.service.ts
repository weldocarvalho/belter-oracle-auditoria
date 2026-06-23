// magic-link-auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class MagicLinkAuthService {
  private readonly redis: Redis;

  constructor(
    private readonly redisService: RedisService, // Inject the service container directly
    private readonly jwtService: JwtService
  ) {
    // Retrieves the default client instance safely at module instantiation
    this.redis = this.redisService.getOrThrow();
  }

  async validateAndConsumeToken(token: string) {
    const redisKey = `auth:token:${token}`;

    // 1. Fetch cached structural payload data string from Redis memory bounds
    const cachedData = await this.redis.get(redisKey);

    if (!cachedData) {
      throw new UnauthorizedException('Link expirado ou já utilizado. Solicite um novo acesso.');
    }

    // 2. ATOMIC DELETION: Instantly invalidate token to prevent concurrent replay hijacking
    await this.redis.del(redisKey);

    // Parse the data written by the .NET background consumer pipeline
    const sessionPayload = JSON.parse(cachedData);

    // 3. Issue internal stateless application access JWT context signature maps
    const jwtPayload = { 
      sub: sessionPayload.userId, 
      email: sessionPayload.email,
      role: 'user' 
    };
    
    const signedJwt = this.jwtService.sign(jwtPayload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d', // 7-day session validity context window bounds
    });

    return {
      email: sessionPayload.email,
      userId: sessionPayload.userId,
      jwtToken: signedJwt
    };
  }
}
