'use client'

import { useState } from 'react'

import { trpc } from '~/lib/trpc/client'

export function LatestPost() {
  const [latestPost] = trpc.post.getLatest.useSuspenseQuery()

  const utils = trpc.useUtils()

  const [name, setName] = useState('')

  const createPost = trpc.post.create.useMutation({
    onSuccess: async () => {
      await utils.post.invalidate()

      setName('')
    },
  })

  return (
    <div className="w-full max-w-xs">
      {latestPost ? <p className="truncate">Your most recent post: {latestPost.name}</p> : <p>You have no posts yet.</p>}
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          createPost.mutate({ name })
        }}
      >
        <input
          className="w-full rounded-full px-4 py-2 text-black"
          onChange={(e) => setName(e.target.value)}
          placeholder="Title"
          type="text"
          value={name}
        />
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
          type="submit"
        >
          {createPost.isPending ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
