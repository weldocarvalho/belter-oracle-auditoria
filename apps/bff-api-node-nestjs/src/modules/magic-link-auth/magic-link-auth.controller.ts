// magic-link-auth.controller.ts
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { MagicLinkAuthPublisher } from './magic-link-auth.publisher'; 
import { UserAuthEventRequest } from './magic-link-auth.contracts';
import { Get, Query, UnauthorizedException } from '@nestjs/common';
import type { MagicLinkAuthService } from './magic-link-auth.service';
//import { MagicLinkAuthService } from './magic-link-auth.service';

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
  // Inject the publisher and the new service layer
  constructor(
    private readonly authPublisher: MagicLinkAuthPublisher,
    private readonly authService: MagicLinkAuthService
  ) {}

  @Post('magic-link')
  @HttpCode(HttpStatus.ACCEPTED) // Returns 202 Accepted status for optimal frontend responsiveness
  async requestMagicLink(@Body() payload: MagicLinkRequestDto) {
    // Generates a cryptographically secure token for verification lookup validation matches
    const secureToken = randomBytes(32).toString('hex');
    
    // Maps the incoming DTO properties to the required C# contract schema fields
    const eventPayload: UserAuthEventRequest = {
      email: payload.email.trim().toLowerCase(),
      token: secureToken,
      assessmentType: payload.diagnostic.assessmentType,
      manualSelectedGrade: payload.diagnostic.manualSelectedGrade,
      waterIntake: payload.diagnostic.waterIntake,
      circulationProfile: payload.diagnostic.circulationProfile,
      requestedAt: new Date().toISOString()
    };

    // Enqueues the event payload via RabbitMQ
    await this.authPublisher.publishAuthRequested(eventPayload);

    return { status: 'queued' };
  }

  @Get('verify')
  @HttpCode(HttpStatus.OK)
  async verifyMagicLink(@Query('token') token: string) {
    if (!token) {
      throw new UnauthorizedException('Token de autenticação ausente.');
    }

    // Process token validation and immediate consumption
    const userSession = await this.authService.validateAndConsumeToken(token);
    
    // Return session data + JWT back to Next.js route handler
    return {
      statusCode: HttpStatus.OK,
      email: userSession.email,
      userId: userSession.userId,
      token: userSession.jwtToken
    };
  }
}
