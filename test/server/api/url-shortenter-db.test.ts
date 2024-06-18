import { type Session } from "next-auth";
import { describe, it, vi } from "vitest";
import { createContextInner } from "../mock/context";
import { createCaller } from "../mock/app";
import { headers } from "next/headers";
import { db } from "~/server/db";

// 1- mock prisma module
vi.mock("next/headers");

// 2- our tests
// Skip for now
describe.skip("exo procedures testing", async () => {

  // 4- session mocked
  const session: Session = {
    expires: "1",
    user: {
      id: "clgb17vnp000008jjere5g15i",
      email: "abc@test.com",
    },
  };

  const heads = new Headers(headers());
  heads.set("x-trpc-source", "rsc");

  it("Test get full url and increment count", async () => {
    const ctx = await createContextInner({});
    const caller = createCaller({ ...ctx, headers: heads, db, session });

    const result = await caller.urlShortener.getFullUrlAndIncrementCount({shortUrl: 'WLuj5'});
    console.log(result);
  });
});
