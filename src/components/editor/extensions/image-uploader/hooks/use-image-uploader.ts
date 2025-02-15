import imageCompression from 'browser-image-compression'
import { useState } from 'react'
import { toast } from 'sonner'

/**
 * 参考文档
 * https://github.com/Donaldcwl/browser-image-compression
 */
const imageCompressionOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1200,
  useWebWorker: true,
}

export function useUploader({ setImage }: { setImage: (imageUrl: string) => void }) {
  const [isUploading, setIsUploading] = useState<boolean>(false)

  async function uploadImage(image: File) {
    setIsUploading(true)

    const compressedImage = new File([await imageCompression(image, imageCompressionOptions)], image.name) // 上传前压缩

    try {
      const preSignedRes = await fetch('/api/image/pre-signed', {
        body: JSON.stringify({ fileName: image.name }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })

      if (preSignedRes.ok) {
        const { imagePreSignedUrl, imageUrl } = await preSignedRes.json()

        const uploadImageRes = await fetch(imagePreSignedUrl, {
          body: compressedImage,
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
