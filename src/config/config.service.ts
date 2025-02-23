import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

@Injectable()
export class ConfigService {
  private readonly envConfig: { [key: string]: string };

  constructor() {
    const config = dotenv.parse(fs.readFileSync('.env'));
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: { [key: string]: string }): {
    [key: string]: string;
  } {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      GOOGLE_CLIENT_ID: Joi.string().required(),
      GOOGLE_CLIENT_SECRET: Joi.string().required(),
      GOOGLE_CALLBACK_URL: Joi.string().required(),
      MONGODB_URI: Joi.string().required(),
      PORT: Joi.number().default(3000),
      JWT_SECRET: Joi.string().required(),
      SENDER_EMAIL: Joi.string().required(),
      EMAIL_PASSWORD: Joi.string().required(),
      CLOUDINARY_CLOUD_NAME: Joi.string().required(),
      CLOUDINARY_API_KEY: Joi.string().required(),
      CLOUDINARY_API_SECRET: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  get googleClientId(): string {
    return this.envConfig.GOOGLE_CLIENT_ID;
  }

  get googleClientSecret(): string {
    return this.envConfig.GOOGLE_CLIENT_SECRET;
  }

  get googleCallbackUrl(): string {
    return this.envConfig.GOOGLE_CALLBACK_URL;
  }

  get mongoDbUri(): string {
    return this.envConfig.MONGODB_URI;
  }
  get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }
  get port(): number {
    return Number(this.envConfig.PORT);
  }

  get sendGridApiKey(): string {
    return '';
  }
  get senderEmail(): string {
    return this.envConfig.SENDER_EMAIL;
  }
  get emailPassword(): string {
    return this.envConfig.EMAIL_PASSWORD;
  }
  get cloudinaryCloudName(): string {
    return this.envConfig.CLOUDINARY_CLOUD_NAME;
  }

  get cloudinaryApiKey(): string {
    return this.envConfig.CLOUDINARY_API_KEY;
  }

  get cloudinaryApiSecret(): string {
    return this.envConfig.CLOUDINARY_API_SECRET;
  }
}
