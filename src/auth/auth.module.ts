import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from '../schemas/user.schema';
import { ConfigService } from 'src/config/config.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { JwtAuthService } from './services/jwt.service';
import { EmailService } from './services/email.service';
import { OAuth2Client } from 'google-auth-library';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [
    AuthService,
    JwtAuthService,
    JwtAuthGuard,
    EmailService,
    OAuth2Client,
  ],
  controllers: [AuthController],
  exports: [JwtAuthService, MongooseModule],
})
export class AuthModule {}
