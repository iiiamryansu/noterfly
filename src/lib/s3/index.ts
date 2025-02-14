import { S3Client } from '@aws-sdk/client-s3'

const ACCOUNT_ID = process.env.CLOUDFLARE_R2_ACCOUNT_ID as string
const ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID as string
const SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY as string

export const S3 = new S3Client({
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  region: 'auto',
})
