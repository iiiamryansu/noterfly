'use client'

import type { RouterOutputs } from '@trpc/c'
import type { ChangeEvent } from 'react'

import { Button, ButtonGroup } from '@heroui/button'
import { Image } from '@heroui/image'
import { trpc } from '@trpc/c'
import { compressImage } from '@utils/compress-image'
import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'

interface CoverProps {
  note: RouterOutputs['note']['getNote']
}

export function Cover({ note }: CoverProps) {
  const coverInputRef = useRef<HTMLInputElement>(null)

  const [selectedCover, setSelectedCover] = useState<File | null>(null) // 已选中的封面 (file)
  const [uploadedCover, setUploadedCover] = useState<null | string>(null) // 已上传的封面 (url)
  const [isRemovingCover, setIsRemovingCover] = useState<boolean>(false)

  const utils = trpc.useUtils()

  const { isPending: isUploadingCover, mutate: uploadCover } = trpc.s3.getSignedUrl.useMutation({
    onError: () => {
      toast.error('Unable to upload cover. 🫠')
    },
    onSuccess: async ({ signedUrl, url }) => {
      try {
        if (!note || !selectedCover) return

        const res = await fetch(signedUrl, {
          body: await compressImage(selectedCover, 960),
          headers: {
            'Content-Type': selectedCover.type,
          },
          method: 'PUT',
        })

        if (res.ok) {
          setUploadedCover(url) // 更新已上传的封面状态

          updateNote({
            data: {
              cover: url,
            },
            noteId: note.id,
          })
        } else {
          toast.error('Unable to upload cover. 🫠')
        }
      } catch {
        toast.error('Unable to upload cover. 🫠')
      }
    },
  })

  const { mutate: updateNote } = trpc.note.updateNote.useMutation({
    onSuccess: (note) => {
      utils.note.getNote.refetch({ noteId: note.id })
    },
  })

  const handleChangeCover = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setSelectedCover(e.target.files[0]) // 更新已选中的封面状态

        uploadCover({ type: 'cover' }) // 上传封面
      }
    },
    [uploadCover],
  )

  const handleRemoveCover = useCallback(() => {
    try {
      if (!note) return

      setIsRemovingCover(true)
      setUploadedCover(null)

      updateNote({
        data: {
          cover: '/default/cover.png',
        },
        noteId: note.id,
      })
    } catch {
      toast.error('Unable to remove cover. 🫠')
    } finally {
      setIsRemovingCover(false)
    }
  }, [note, updateNote])

  if (!note) return null

  return (
    <section className="group/cover relative">
      <Image
        alt="Cover"
        className="z-10 object-cover"
        height={192}
        isLoading={isUploadingCover || isRemovingCover}
        loading="eager"
        radius="md"
        src={uploadedCover ?? note.cover ?? '/default/cover.png'}
        width={1024}
      />

      <ButtonGroup
        className="absolute bottom-3 right-3 z-20 opacity-0 transition-all duration-300 group-hover/cover:opacity-100"
        radius="sm"
        size="sm"
        variant="shadow"
      >
        <Button className="h-7 text-[10px]" onPress={() => coverInputRef.current?.click()}>
          Change
        </Button>
        <Button className="h-7 text-[10px]" onPress={handleRemoveCover}>
          Remove
        </Button>
      </ButtonGroup>

      <input accept="image/*" className="hidden" onChange={handleChangeCover} ref={coverInputRef} type="file" />
    </section>
  )
}
