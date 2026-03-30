import { Button } from "@/components/ui/button";
import { HomeView } from "@/home/views/homeview";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Image from "next/image";

export default function Home() {
  const queryclient = getQueryClient();
  void queryclient.prefetchQuery(trpc.collection.getmany.queryOptions());
  void queryclient.prefetchQuery(trpc.home.getProductsWithImages.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryclient)}>
      <HomeView />
    </HydrationBoundary>
  );
}
