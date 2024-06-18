/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, router } from '~/server/api/trpc';
import { urlShortenerRouter } from '~/server/api/routers/url-shortener';

export const appRouter = router({
  urlShortener: urlShortenerRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;