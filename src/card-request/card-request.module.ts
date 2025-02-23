import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { CloudinaryConfigService } from 'src/config/cloudinary/cloudinary.config';
import { ConfigService } from 'src/config/config.service';
import { CardRequest, CardRequestSchema } from '../schemas/card-request.schema';
import { CardRequestController } from './card-request.controller';
import { CardRequestService } from './card-request.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CardRequest.name, schema: CardRequestSchema },
    ]),
    AuthModule,
  ],
  providers: [CardRequestService, CloudinaryConfigService, ConfigService],
  controllers: [CardRequestController],
  exports: [CardRequestService],
})
export class CardRequestModule {}
