import { HomeView } from "@/home/views/homeview";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

export default async function Home() {
  const queryclient = getQueryClient();

  // Pre-fetching data on the server
  await Promise.all([
    queryclient.prefetchQuery(trpc.collection.getmany.queryOptions()),
    queryclient.prefetchQuery(trpc.home.getProductsWithImages.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryclient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
