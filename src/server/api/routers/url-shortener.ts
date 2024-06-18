import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
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

  createProtected: protectedProcedure
  .input(z.object({ shortUrl: z.string().min(1).max(5) }))
  .mutation(async({ctx, input}) => {
    console.log(ctx, input);
    return input;
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

  getPagingData: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        page: z.number().min(0),
        cursor: z.string().nullish(),
      }),
    )
    .query(async ({ input: { limit = 10, page = 0 }, ctx }) => {
      await delay();
      const [items, itemCounts] = await ctx.db.$transaction([
        ctx.db.urlShortener.findMany({
          take: limit,
          skip: (page - 1) * limit,
          orderBy: {
            updatedAt: "desc",
          },
        }),
        ctx.db.urlShortener.count(),
      ]);

      // Print log for debugging purpose
      console.log(items);
      return {
        items,
        itemCounts,
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

const delay = async () => (
  new Promise((resolve) => {
    setTimeout(() => {resolve(true)}, 1000)
  })
);