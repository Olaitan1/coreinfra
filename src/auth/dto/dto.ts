import { Allow, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { UserRole } from 'src/schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @Allow()
  password: string;

  @IsOptional()
  firstName: string;

  @IsOptional()
  lastName: string;

  @IsEnum(UserRole)
  role: UserRole;

  @Allow()
  phoneNumber: string;
}

export class VerifyEmailDto {
  @Allow()
  email: string;
  @Allow()
  otp: string;
}

export class LoginDto {
  @IsEmail()
  email: string;
  @Allow()
  password: string;
}

export class ResendOtpDto {
  @Allow()
  email: string;
}

export class VerifyGoogleTokenDto {
  @Allow()
  token: string;
}
