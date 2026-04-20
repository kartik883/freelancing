import { HomeLoadingState, HomeView } from "@/home/views/homeview";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export const dynamic = "force-dynamic";

export default async function Home() {
  const queryclient = getQueryClient();
  

  // Pre-fetching data on the server
  await Promise.all([
    queryclient.prefetchQuery(trpc.collection.getmany.queryOptions()),
    queryclient.prefetchQuery(trpc.home.getProductsWithImages.queryOptions()),
    queryclient.prefetchQuery(trpc.home.getVideoUploads.queryOptions()),
  ]);

  return (
   <HydrationBoundary state={dehydrate(queryclient)}>
  <Suspense fallback={<HomeLoadingState/>}>
    <ErrorBoundary fallback={
      <div>
        <h1>Something went wrong</h1>
        <p>Please try again later</p>
      </div>}>
      <HomeView />
    </ErrorBoundary>

  </Suspense>

</HydrationBoundary>
  );
}


