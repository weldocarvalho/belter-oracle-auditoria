import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
// import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PhotoScoringPresignService {

    async generatePresignedUrl(userId: string, fileType: string) { 
        const data = fileType;
        return data;
    }
    
//   private s3Client: S3Client;
//   private bucketName: string;

//   constructor() {
//     const accountId = process.env.R2_ACCOUNT_ID;
//     this.bucketName = process.env.R2_BUCKET_NAME;

//     this.s3Client = new S3Client({
//       region: 'auto',
//       endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
//       credentials: {
//         accessKeyId: process.env.R2_ACCESS_KEY_ID,
//         secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
//       },
//     });
//   }

//   async generatePresignedUrl(userId: string, fileType: string) {
//     const extension = fileType.split('/')[1] || 'jpg';
//     const uniqueId = uuidv4();
//     // Deterministic, secure key path separating files by user ID
//     const fileKey = `uploads/${userId}/${uniqueId}.${extension}`;

//     const command = new PutObjectCommand({
//       Bucket: this.bucketName,
//       Key: fileKey,
//       ContentType: fileType,
//     });

//     try {
//       // 60-second expiration limit to guarantee tight security windows
//       const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 60 });
      
//       return {
//         uploadUrl,
//         fileKey,
//       };
//     } catch (error) {
//       throw new InternalServerErrorException('Failed to generate secure upload credentials.');
//     }
//   }
}
