import { render } from '@testing-library/react'
import { test } from 'vitest'

import RootPage from '~/app/page'

test('RootPage', () => {
  render(<RootPage />)
})
