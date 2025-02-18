import { Button } from '@heroui/react'
import { type Editor, NodeViewWrapper } from '@tiptap/react'
import { ImageUploadIcon } from 'hugeicons-react'
import { type ChangeEvent, useCallback, useRef } from 'react'

import useImageUploader from '~/features/editor/extensions/image-uploader/use-image-uploader'

interface ImageUploaderBlockProps {
  editor: Editor
  getPos: () => number
  onUpload: (url: string) => void
}

export default function ImageUploaderBlock({ editor, getPos }: ImageUploaderBlockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const { isUploading, uploadImage } = useImageUploader({ setImage })

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadImage(e.target.files[0])
      }
    },
    [uploadImage],
  )

  return (
    <NodeViewWrapper>
      <div className="flex h-40 items-center justify-center rounded-small border border-divider">
        <Button
          isDisabled={isUploading}
          isLoading={isUploading}
          onPress={() => fileInputRef.current?.click()}
          size="sm"
          startContent={isUploading ? null : <ImageUploadIcon className="size-4" />}
          variant="solid"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>

        <input accept="image/*" className="hidden" onChange={handleFileChange} ref={fileInputRef} type="file" />
      </div>
    </NodeViewWrapper>
  )
}
