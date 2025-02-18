import { Document as TiptapDocument } from '@tiptap/extension-document'

const Document = TiptapDocument.extend({
  content: '(block|columns)+',
})

export default Document
