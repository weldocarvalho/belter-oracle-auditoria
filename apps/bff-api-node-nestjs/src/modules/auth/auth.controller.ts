import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthTokenResponse, DiagnosticInput } from './auth.contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { z } from 'zod';

const RegisterSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres'),
  diagnostic: z.object({
    assessmentType: z.string().min(1),
    manualSelectedGrade: z.number().int().min(1).max(4),
    waterIntake: z.string().min(1),
    circulationProfile: z.string().min(1),
  }),
});

const LoginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

const GoogleSchema = z.object({
  email: z.string().email('E-mail inválido'),
  googleSubject: z.string().min(1, 'googleSubject é obrigatório'),
  diagnostic: z
    .object({
      assessmentType: z.string().min(1),
      manualSelectedGrade: z.number().int().min(1).max(4),
      waterIntake: z.string().min(1),
      circulationProfile: z.string().min(1),
    })
    .optional()
    .nullable(),
});

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(RegisterSchema))
    body: {
      email: string;
      password: string;
      diagnostic: DiagnosticInput;
    },
  ): Promise<AuthTokenResponse> {
    return this.authService.register(
      body.email.trim().toLowerCase(),
      body.password,
      body.diagnostic,
    );
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginSchema))
    body: {
      email: string;
      password: string;
    },
  ): Promise<AuthTokenResponse> {
    return this.authService.login(
      body.email.trim().toLowerCase(),
      body.password,
    );
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async googleLogin(
    @Body(new ZodValidationPipe(GoogleSchema))
    body: {
      email: string;
      googleSubject: string;
      diagnostic: DiagnosticInput | null;
    },
  ): Promise<AuthTokenResponse> {
    return this.authService.googleLogin(
      body.email.trim().toLowerCase(),
      body.googleSubject,
      body.diagnostic,
    );
  }
}
