export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: noteId } = await params

  return (
    <div className="flex h-full flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold text-primary-900">Note</h1>
      <p className="text-sm font-medium text-primary-700">{noteId}</p>
    </div>
  )
}
