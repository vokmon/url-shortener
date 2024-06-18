import { type Session } from "next-auth";
import { beforeEach, describe, expect, it, vi } from "vitest";
import db from "../mock/db/prisma-mock";
import { createContextInner } from "../mock/context";
import { createCaller } from "../mock/app";
import { headers } from "next/headers";

// 1- mock prisma module
vi.mock("../../mock/db/prisma-mock"); // 1
vi.mock("next/headers");

// 2- our tests
describe("exo procedures testing", async () => {
  // 3- Reset everything
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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
    db.urlShortener.findUnique.mockResolvedValue({
      counts: 1,
      createdAt: new Date(),
      shortUrl: "1234",
      fullUrl: "",
      updatedAt: new Date(),
    });

    db.urlShortener.update.mockResolvedValue({
      counts: 2,
      createdAt: new Date(),
      shortUrl: "1234",
      fullUrl: "",
      updatedAt: new Date(),
    });

    const ctx = await createContextInner({});
    const caller = createCaller({ ...ctx, headers: heads, db, session });

    const result = await caller.urlShortener.getFullUrlAndIncrementCount({shortUrl: '1234'});

    // no idea how to fix yet
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(db.urlShortener.findUnique).toHaveBeenCalled();

    console.log(result);
  });

  it("Test call protected route - invalid input", async() => {
    const ctx = await createContextInner({});
    const caller = createCaller({ ...ctx, headers: heads, db, session });

    await expect(() => caller.urlShortener.createProtected({shortUrl: '12343434'}))
    .rejects.toThrowError("String must contain at most 5 character(s)");
  })

  it("Test call protected route", async() => {
    const ctx = await createContextInner({});
    const caller = createCaller({ ...ctx, headers: heads, db, session });
    const result = await caller.urlShortener.createProtected({shortUrl: '1234'});

    console.log(result);
  })

  it("Test call protected route - no session pass in", async() => {
    const ctx = await createContextInner({});
    const caller = createCaller({ ...ctx, headers: heads, db, session: null });

    await expect(() => caller.urlShortener.createProtected({shortUrl: '1234'}))
    .rejects.toThrowError("UNAUTHORIZED");
  })
});
