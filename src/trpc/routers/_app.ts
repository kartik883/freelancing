import { baseProcedure, createTRPCRouter } from '../init';
import collectionRouter from '@/collection/server/procedure';
import { homeRouter } from '@/home/server/procedure';
import { profileRouter } from '@/profile/server/procedure';
import { cartRouter } from '@/cart/server/procedure';

export const appRouter = createTRPCRouter({
  collection: collectionRouter,
  home: homeRouter,
  profile: profileRouter,
  cart: cartRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;