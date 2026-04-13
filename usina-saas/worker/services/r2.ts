import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import * as fs from "fs";

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_VIDEOS_BUCKET = process.env.R2_BUCKET_VIDEOS ?? "usina-videos";
export const R2_CLIPS_BUCKET = process.env.R2_BUCKET_CLIPS ?? "usina-clips";

/** Baixa arquivo do R2 e salva em disco */
export async function downloadFromR2(bucket: string, key: string, destPath: string): Promise<void> {
  const { Body } = await r2.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  if (!Body) throw new Error(`R2: objeto vazio — ${bucket}/${key}`);

  await new Promise<void>((resolve, reject) => {
    const stream = Body as Readable;
    const file = fs.createWriteStream(destPath);
    stream.pipe(file);
    file.on("finish", resolve);
    file.on("error", reject);
    stream.on("error", reject);
  });
}

/** Faz upload de arquivo local para o R2 */
export async function uploadToR2(bucket: string, key: string, filePath: string, contentType = "video/mp4"): Promise<void> {
  const body = fs.readFileSync(filePath);
  await r2.send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
}
