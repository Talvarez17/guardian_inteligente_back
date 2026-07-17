import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {

  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.getOrThrow<string>('DO_SPACE_BUCKET');
    this.region = this.configService.getOrThrow<string>('DO_SPACE_REGION');

    this.s3Client = new S3Client({
      endpoint: `https://${this.region}.digitaloceanspaces.com`,
      region: this.region,
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('DO_SPACE_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow<string>('DO_SPACE_SECRET_KEY'),
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder: string): Promise<string> {
    const key = `${folder}/${randomUUID()}-${file.originalname}`;

    await this.s3Client.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
    }));

    return `https://${this.bucket}.${this.region}.digitaloceanspaces.com/${key}`;
  }

  async deleteFile(fileUrl: string): Promise<void> {
    const key = decodeURIComponent(new URL(fileUrl).pathname.replace(/^\//, ''));

    await this.s3Client.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    }));
  }
}
