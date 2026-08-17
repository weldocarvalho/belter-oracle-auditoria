import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PhotoScoringPresignController } from './photo-scoring-presign.controller';
import { PhotoScoringPresignService } from './photo-scoring-presign.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  controllers: [PhotoScoringPresignController],
  providers: [PhotoScoringPresignService, JwtAuthGuard],
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
})
export class PhotoScoringPresignModule {}
