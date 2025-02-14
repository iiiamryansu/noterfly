import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuid } from 'uuid'

import { getUser } from '~/actions/auth'
import { S3 } from '~/lib/s3'

const BUCKET = process.env.CLOUDFLARE_R2_BUCKET as string
const PUBLIC_URL = process.env.CLOUDFLARE_R2_PUBLIC_URL as string

// Get Pre-Signed URL for Upload
export async function POST() {
  const userId = (await getUser())?.id

  if (!userId) {
    return Response.json({ error: 'User not found!', status: 401 })
  }

  const imagePath = `users/${userId}/files/images/${uuid()}`
  const imageUrl = `${PUBLIC_URL}/${imagePath}`

  try {
    const imagePreSignedUrl = await getSignedUrl(
      S3,
      new PutObjectCommand({
        Bucket: BUCKET,
        Key: imagePath,
      }),
      {
        expiresIn: 600,
      },
    )

    return Response.json({ imagePreSignedUrl, imageUrl })
  } catch (error: unknown) {
    if (error instanceof Error) {
      return Response.json({ error: error.message })
    }

    return Response.json({ error: 'An unknown error occurred!' })
  }
}
