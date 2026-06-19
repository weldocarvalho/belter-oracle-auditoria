import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface PresignedUrlResponse {
  uploadUrl: string;
  fileKey: string;
}

@Injectable()
export class PhotoScoringPresignService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.getOrThrow<string>('AWS_BUCKET_NAME');

    // O SDK da AWS configura o endpoint automaticamente usando a região
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async generatePresignedUrl(userId: string, fileType: string): Promise<PresignedUrlResponse> {
    const extension = this.getExtensionFromMime(fileType);
    const uniqueId = uuidv4();
    const fileKey = `uploads/${userId}/${uniqueId}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: fileKey,
      ContentType: fileType,
    });

    try {
      // Mantém a expiração estrita de 60 segundos
      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 60 });

      return {
        uploadUrl,
        fileKey,
      };
    } catch (error) {
      console.error('AWS S3 Presign Error:', error);
      throw new InternalServerErrorException('Failed to generate secure upload credentials.');
    }
  }

  private getExtensionFromMime(fileType: string): string {
    if (!fileType || !fileType.includes('/')) {
      return 'jpg';
    }
    const ext = fileType.split('/')[1];
    return ext === 'jpeg' ? 'jpg' : ext;
  }
}
