import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// export const createTRPCContext = cache(async () => {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   });
//   return {
//     userId: session?.user?.id ?? null,
//     user: session?.user ?? null,
//   };
// });

export const createTRPCContext = cache(async () => {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return {
    headers: requestHeaders,
    userId: session?.user?.id ?? null,
    user: session?.user ?? null,
  };
});

const t = initTRPC.context<typeof createTRPCContext>().create();

// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

// Protected procedure — throws if not authenticated
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId, user: ctx.user! } });
});