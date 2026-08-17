import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRpcClient } from './auth-rpc.client';
import { AuthTokenResponse, DiagnosticInput } from './auth.contracts';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRpcClient: AuthRpcClient,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    diagnostic: DiagnosticInput,
  ): Promise<AuthTokenResponse> {
    const result = await this.authRpcClient.authenticate({
      mode: 'register',
      email,
      password,
      assessmentType: diagnostic.assessmentType,
      manualSelectedGrade: diagnostic.manualSelectedGrade,
      waterIntake: diagnostic.waterIntake,
      circulationProfile: diagnostic.circulationProfile,
    });

    if (!result.success || !result.userId) {
      if (result.error === 'email_in_use') {
        throw new ConflictException('E-mail já cadastrado. Faça login.');
      }
      throw new BadRequestException('Não foi possível criar a conta.');
    }

    return this.buildTokenResponse(result.userId, email);
  }

  async login(email: string, password: string): Promise<AuthTokenResponse> {
    const result = await this.authRpcClient.authenticate({
      mode: 'login',
      email,
      password,
    });

    if (!result.success || !result.userId) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    return this.buildTokenResponse(result.userId, email);
  }

  async googleLogin(
    email: string,
    googleSubject: string,
    diagnostic: DiagnosticInput | null,
  ): Promise<AuthTokenResponse> {
    const result = await this.authRpcClient.authenticate({
      mode: 'google',
      email,
      googleSubject,
      assessmentType: diagnostic?.assessmentType,
      manualSelectedGrade: diagnostic?.manualSelectedGrade,
      waterIntake: diagnostic?.waterIntake,
      circulationProfile: diagnostic?.circulationProfile,
    });

    if (!result.success || !result.userId) {
      throw new UnauthorizedException(
        'Não foi possível autenticar com o Google.',
      );
    }

    return this.buildTokenResponse(result.userId, email);
  }

  private async buildTokenResponse(
    userId: string,
    email: string,
  ): Promise<AuthTokenResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email,
    });

    return {
      accessToken,
      user: { id: userId, email },
    };
  }
}
