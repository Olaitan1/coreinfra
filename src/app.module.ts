import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { CardRequestModule } from './card-request/card-request.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [forwardRef(() => ConfigModule)],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.mongoDbUri,
      }),
      inject: [ConfigService],
    }),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    CardRequestModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
