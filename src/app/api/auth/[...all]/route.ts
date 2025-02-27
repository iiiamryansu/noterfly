import { auth } from '@auth/s'
import { toNextJsHandler } from 'better-auth/next-js'

const { GET, POST } = toNextJsHandler(auth.handler)

export { GET, POST }
