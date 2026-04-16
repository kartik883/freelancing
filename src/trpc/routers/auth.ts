import { z } from "zod";
import { createTRPCRouter, baseProcedure, protectedProcedure } from "../init";

export const authRouter = createTRPCRouter({
  /**
   * Returns the current session (user + userId).
   * Use this for server-prefetching in RSC via trpc caller.
   */
  getSession: baseProcedure.query(async ({ ctx }) => {
    return {
      user: ctx.user ?? null,
      userId: ctx.userId ?? null,
      isAuthenticated: !!ctx.userId,
    };
  }),

  /**
   * Returns current user profile data (protected).
   */
  getMe: protectedProcedure.query(async ({ ctx }) => {
    return { user: ctx.user, userId: ctx.userId };
  }),
});

export type AuthRouter = typeof authRouter;
