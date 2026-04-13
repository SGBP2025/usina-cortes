import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const accountId = process.env.R2_ACCOUNT_ID!;

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_VIDEOS_BUCKET = process.env.R2_BUCKET_VIDEOS ?? "usina-videos";
export const R2_CLIPS_BUCKET = process.env.R2_BUCKET_CLIPS ?? "usina-clips";

/** URL presignada para UPLOAD (PUT) — validade 1 hora */
export async function getUploadUrl(bucket: string, key: string): Promise<string> {
  return getSignedUrl(
    r2,
    new PutObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
}

/** URL presignada para DOWNLOAD (GET) — validade 1 hora */
export async function getDownloadUrl(bucket: string, key: string): Promise<string> {
  return getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    { expiresIn: 3600 }
  );
}

/** Deleta objeto do bucket */
export async function deleteObject(bucket: string, key: string): Promise<void> {
  await r2.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
