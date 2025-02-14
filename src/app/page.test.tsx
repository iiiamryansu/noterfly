import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import RootPage from '~/app/page'

test('RootPage', () => {
  render(<RootPage />)

  expect(screen.getByRole('heading', { level: 1, name: 'Noterfly' })).toBeDefined()
})
