import "dotenv/config";
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Neon storage requires path-style addressing. The SDK reads the AWS_* env vars.
export const s3 = new S3Client({ forcePathStyle: true });

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export function storageBucket(): string {
  const bucket = process.env.S3_BUCKET_NAME;
  if (!bucket) throw new Error("S3_BUCKET_NAME is not set");
  return bucket;
}

export async function uploadImage(
  key: string,
  body: Uint8Array,
  contentType: string,
): Promise<{ key: string; url: string }> {
  if (!key) throw new Error("Object key is required");
  if (!IMAGE_TYPES.has(contentType)) {
    throw new Error(
      "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed",
    );
  }

  const bucket = storageBucket();
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  const url = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: bucket, Key: key }),
    {
      expiresIn: 3600,
    },
  );

  return { key, url };
}
