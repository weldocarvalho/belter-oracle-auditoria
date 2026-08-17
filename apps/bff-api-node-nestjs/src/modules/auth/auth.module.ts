import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRpcClient } from './auth-rpc.client';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (configService.get<string>('JWT_EXPIRES_IN') ??
            '24h') as '24h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRpcClient, JwtAuthGuard],
  exports: [JwtModule, JwtAuthGuard],
})
export class AuthModule {}
