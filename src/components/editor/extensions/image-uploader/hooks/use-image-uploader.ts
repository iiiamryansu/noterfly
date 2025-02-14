import { useState } from 'react'
import { toast } from 'sonner'

export function useUploader({ setImage }: { setImage: (imageUrl: string) => void }) {
  const [isUploading, setIsUploading] = useState<boolean>(false)

  async function uploadImage(image: File) {
    setIsUploading(true)

    try {
      const preSignedRes = await fetch('/api/image/pre-signed', {
        body: JSON.stringify({ fileName: image.name }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (preSignedRes.ok) {
        const { imagePreSignedUrl, imageUrl } = await preSignedRes.json()

        const uploadImageRes = await fetch(imagePreSignedUrl, {
          body: image,
          method: 'PUT',
        })

        if (uploadImageRes.ok) {
          setImage(imageUrl)
        } else {
          toast.error('Image upload failed!')
        }
      } else {
        toast.error('Get Pre-Signed URL failed!')
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('An unknown error occurred!')
      }
    } finally {
      setIsUploading(false)
    }
  }

  return { isUploading, uploadImage }
}
