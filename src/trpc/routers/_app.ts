import { createTRPCRouter } from '../init';
import collectionRouter from '@/collection/server/procedure';
import { homeRouter } from '@/home/server/procedure';
import { profileRouter } from '@/profile/server/procedure';
import { cartRouter } from '@/cart/server/procedure';
import { onboardingRouter } from './onboarding';
import { authRouter } from './auth';

export const appRouter = createTRPCRouter({
  auth: authRouter,
  onboarding: onboardingRouter,
  collection: collectionRouter,
  home: homeRouter,
  profile: profileRouter,
  cart: cartRouter,
});


// Export type definition of API
export type AppRouter = typeof appRouter;