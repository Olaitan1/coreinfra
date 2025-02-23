import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import {
  CreateUserDto,
  LoginDto,
  ResendOtpDto,
  VerifyEmailDto,
  VerifyGoogleTokenDto,
} from './dto/dto';
import { Request } from 'express';

@Controller({ path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body() input: LoginDto) {
    return this.authService.login(input);
  }

  @Post('google')
  async googleAuth(@Body() input: VerifyGoogleTokenDto) {
    const res = await this.authService.verifyGoogleToken(input.token);
    return res;
  }

  @Post('resend-otp')
  async resendOtp(@Body() input: ResendOtpDto) {
    return this.authService.resendOtp(input.email);
  }

  @Post('verify-email')
  async verifyEmail(@Body() input: VerifyEmailDto) {
    return this.authService.verifyEmailOtp(input.otp, input.email);
  }

  @Get('user/:id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Req() req: Request) {
    return this.authService.getUser(req.user.id);
  }
}
