# R2 Direct Upload & Presigned URLs

**The Issue**: Allowing Next.js to upload untrusted files directly to your R2 storage bucket exposes your system to infinite-size uploads, denial-of-wallet attacks, and malicious binary execution.

**The Fix**: When NestJS generates the presigned URL via the @aws-sdk/s3-request-presigner library, enforce strict runtime constraints within the cryptographic signature.



`// NestJS BFF: Enforce strict constraints on the presigned URL`

`const command = new PutObjectCommand({`

`  Bucket: process.env.R2_BUCKET_NAME,`

``  Key: `uploads/raw/${userId}/${crypto.randomUUID()}.jpg`,``

`  ContentType: 'image/jpeg',`

`  ContentLength: 5 * 1024 * 1024 // Hard limit: 5MB maximum file size`

`});`



`const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });`