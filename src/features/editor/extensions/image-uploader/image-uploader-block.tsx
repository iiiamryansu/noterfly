'use client'

import type { Editor } from '@tiptap/react'
import type { ChangeEvent } from 'react'

import { Button } from '@heroui/react'
import { NodeViewWrapper } from '@tiptap/react'
import { ImageUploadIcon } from 'hugeicons-react'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

import { trpc } from '~/lib/trpc/client'
import { compressImage } from '~/utils/compress-image'

interface ImageUploaderBlockProps {
  editor: Editor
  getPos: () => number
  onUpload: (url: string) => void
}

export default function ImageUploaderBlock({ editor, getPos }: ImageUploaderBlockProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const setImage = useCallback(
    (imageUrl: string) => {
      editor
        .chain()
        .setImage({ src: imageUrl })
        .deleteRange({ from: getPos(), to: getPos() }) // 删除当前的 imageUploader 节点
        .focus()
        .run()
    },
    [editor, getPos],
  )

  /* ---------------------------------- 上传图片 ---------------------------------- */
  const { isPending: isUploadingImage, mutate: uploadImage } = trpc.s3.getSignedUrl.useMutation({
    onError: () => {
      toast.error('Unable to upload image. 🫠')
    },
    onSuccess: async ({ signedUrl, url }) => {
      try {
        const res = await fetch(signedUrl, {
          body: await compressImage(selectedImage!, 1200),
          headers: {
            'Content-Type': selectedImage!.type,
          },
          method: 'PUT',
        })

        if (res.ok) {
          setImage(url)
        } else {
          toast.error('Unable to upload image. 🫠')
        }
      } catch {
        toast.error('Unable to upload image. 🫠')
      }
    },
  })

  /* --------------------------------- 处理图片变化 --------------------------------- */
  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedImage(e.target.files[0]) // 更新已选中的图片状态

        uploadImage({ type: 'image' }) // 上传图片
      }
    },
    [uploadImage],
  )

  /* ----------------------------------------------------------------------------- */

  return (
    <NodeViewWrapper>
      <div className="flex h-40 items-center justify-center rounded-small border border-divider">
        <Button
          isLoading={isUploadingImage}
          onPress={() => imageInputRef.current?.click()}
          size="sm"
          startContent={isUploadingImage ? null : <ImageUploadIcon className="size-4" />}
          variant="solid"
        >
          {isUploadingImage ? 'Uploading...' : 'Upload'}
        </Button>

        <input accept="image/*" className="hidden" onChange={handleImageChange} ref={imageInputRef} type="file" />
      </div>
    </NodeViewWrapper>
  )
}
