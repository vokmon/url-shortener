import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  // protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const urlShortenerRouter = createTRPCRouter({
  getFullUrlAndIncrementCount: publicProcedure
    .input(z.object({ shortUrl: z.string().min(1).max(5) }))
    .query(async ({ ctx, input }) => {
      const existingRecord = await ctx.db.urlShortener.findUnique({
        where: { shortUrl: input.shortUrl },
      });

      if (!existingRecord) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot find the slug ${input.shortUrl}`,
        });
      }

      return ctx.db.urlShortener.update({
        data: {
          counts: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
        where: {
          shortUrl: input.shortUrl,
        },
      });
    }),

  create: publicProcedure
    .input(z.object({ fullUrl: z.string().min(1).url() }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      const existingRecord = await ctx.db.urlShortener.findUnique({
        where: { fullUrl: input.fullUrl },
      });
      if (existingRecord) {
        return existingRecord;
      }
      return ctx.db.urlShortener.create({
        data: {
          fullUrl: input.fullUrl,
        },
      });
    }),

  getInfiniteData: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input: { limit = 10, cursor }, ctx }) => {
      const items = await ctx.db.urlShortener.findMany({
        take: limit + 1,
        cursor: cursor ? { shortUrl: cursor } : undefined,
        orderBy: {
          updatedAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.shortUrl;
      }

      // Print log for debugging purpose
      console.log(items);
      return {
        items,
        nextCursor,
      };
    }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
