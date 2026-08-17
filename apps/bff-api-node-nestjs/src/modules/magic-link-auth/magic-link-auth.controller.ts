import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { MagicLinkAuthPublisher } from './magic-link-auth.publisher';
import { CreateUserEventRequest } from './magic-link-auth.contracts';

interface MagicLinkRequestDto {
  email: string;
  diagnostic: {
    assessmentType: string;
    manualSelectedGrade: number;
    waterIntake: string;
    circulationProfile: string;
  };
}

@Controller('api/v1/auth')
export class MagicLinkAuthController {
  constructor(private readonly authPublisher: MagicLinkAuthPublisher) {}

  @Post('magic-link')
  @HttpCode(HttpStatus.ACCEPTED)
  async requestMagicLink(@Body() payload: MagicLinkRequestDto) {
    const secureToken = randomBytes(32).toString('hex');

    const eventPayload: CreateUserEventRequest = {
      email: payload.email.trim().toLowerCase(),
      token: secureToken,
      assessmentType: payload.diagnostic.assessmentType,
      manualSelectedGrade: payload.diagnostic.manualSelectedGrade,
      waterIntake: payload.diagnostic.waterIntake,
      circulationProfile: payload.diagnostic.circulationProfile,
      requestedAt: new Date().toISOString(),
    };

    await this.authPublisher.publishAuthRequested(eventPayload);

    return { status: 'queued' };
  }
}
