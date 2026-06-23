// magic-link-auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { RedisModule, RedisModuleOptions } from '@liaoliaots/nestjs-redis';

import { MagicLinkAuthController } from './magic-link-auth.controller';
import { MagicLinkAuthService } from './magic-link-auth.service';
import { MagicLinkAuthPublisher } from './magic-link-auth.publisher';

// Dynamic Factories (forRootAsync / registerAsync): Avoid loading sensitive information
// (like JWT_SECRET or credentials) directly from process.env during compilation.
// Wrapping them in a dynamic factor function forces NestJS to wait until the ConfigModule
// completes boot cycles before establishing outbound runtime connection maps

@Module({
  // imports: [
  //   ConfigModule,
    
  //   // Wire up the Redis Client with strict type safety casting bounds
  //   RedisModule.forRootAsync({
  //     imports: [ConfigModule],
  //     inject: [ConfigService],
  //     // Use any[] args to satisfy the library's internal (...args: unknown[]) typing constraint
  //     useFactory: (...args: any[]): RedisModuleOptions => {
  //       const configService = args[0] as ConfigService;
  //       return {
  //         config: {
  //           url: configService.getOrThrow<string>('REDIS_URL', 'redis://localhost:6379'),
  //           keyPrefix: 'serviceworker:',
  //           //ttl: 900,
  //         },
  //       };
  //     },
  //   }),

  //   // Wire up the Stateless JWT Token engine mapping strong type allocations
  //   JwtModule.registerAsync({
  //     imports: [ConfigModule],
  //     inject: [ConfigService],
  //     useFactory: (...args: any[]): JwtModuleOptions => {
  //       const configService = args[0] as ConfigService;
  //       const secret = configService.getOrThrow<string>('JWT_SECRET');
  //       if (!secret) {
  //         throw new Error('Config Fault: JWT_SECRET environment configuration variable is missing.');
  //       }

  //       return {
  //         secret: secret,
  //         signOptions: {
  //           // Cast strictly to any to satisfy type variance restrictions with StringValue union mappings
  //           expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN', '7d') as any,
  //         },
  //       };
  //     },
  //   }),
  // ],
  controllers: [
    MagicLinkAuthController
  ],
  providers: [
    // MagicLinkAuthService, 
    MagicLinkAuthPublisher
  ]
  // exports: [
  //   MagicLinkAuthService
  // ],
})
export class MagicLinkAuthModule {}
