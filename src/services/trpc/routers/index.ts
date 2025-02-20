import { createCallerFactory, createTRPCRouter } from '~/services/trpc'
import { postRouter } from '~/services/trpc/routers/post'
import { s3Router } from '~/services/trpc/routers/s3'
import { userRouter } from '~/services/trpc/routers/user'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  s3: s3Router,
  user: userRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
