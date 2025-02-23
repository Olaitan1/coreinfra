import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config.service';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryConfigService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.cloudinaryCloudName,
      api_key: this.configService.cloudinaryApiKey,
      api_secret: this.configService.cloudinaryApiSecret,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'car-images' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result.secure_url); 
        },
      );

      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  // async uploadImage(file: Express.Multer.File): Promise<string>
  // {
  //   const result: UploadApiResponse = await cloudinary.uploader.upload(file.path);
  //   return result.secure_url;
  // }
}
