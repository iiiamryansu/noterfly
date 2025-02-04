export type Note = {
  content: string
  createdAt: Date
  id: string
  notebookId: string
  title: string
  updatedAt: Date
}

export const notes: Note[] = [
  {
    content: 'Welcome to your new note-taking journey! This is your first note. You can edit it or create a new one.',
    createdAt: new Date('2025-01-15T10:00:00'),
    id: '1',
    notebookId: 'nb1',
    title: 'Getting Started with Notes',
    updatedAt: new Date('2025-01-15T10:30:00'),
  },
  {
    content:
      '1. Click the "Note" button to create a new note\n2. Use notebooks to organize your notes\n3. Try our markdown support\n4. Use templates for quick starts',
    createdAt: new Date('2025-01-14T15:00:00'),
    id: '2',
    notebookId: 'nb1',
    title: 'Quick Tips & Tricks',
    updatedAt: new Date('2025-01-14T15:20:00'),
  },
  {
    content: '# Meeting Notes Template\n\n## Agenda\n- \n\n## Decisions\n- \n\n## Action Items\n- [ ] \n\n## Next Steps\n- ',
    createdAt: new Date('2025-01-13T09:00:00'),
    id: '3',
    notebookId: 'nb2',
    title: 'Meeting Notes Template',
    updatedAt: new Date('2025-01-13T09:15:00'),
  },
  {
    content: "# Daily Journal Template\n\n## Today's Goals\n- \n\n## Reflections\n- \n\n## Tomorrow's Plan\n- ",
    createdAt: new Date('2025-01-12T20:30:00'),
    id: '4',
    notebookId: 'nb2',
    title: 'Daily Journal Template',
    updatedAt: new Date('2025-01-12T20:45:00'),
  },
  {
    content:
      'Markdown Cheatsheet:\n\n# H1\n## H2\n### H3\n\n**bold**\n*italic*\n\n- list item\n1. numbered list\n\n```code block```\n> quote',
    createdAt: new Date('2025-01-11T16:00:00'),
    id: '5',
    notebookId: 'nb3',
    title: 'Markdown Guide',
    updatedAt: new Date('2025-01-11T16:30:00'),
  },
]
