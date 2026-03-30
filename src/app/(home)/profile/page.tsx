import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProfileView } from "@/profile/views/profileview";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default async function ProfilePage() {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.profile.getMe.queryOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense
                fallback={
                    <div className="min-h-screen flex items-center justify-center">
                        <Loader2 size={22} className="animate-spin text-primary/50" />
                    </div>
                }
            >
                <ProfileView />
            </Suspense>
        </HydrationBoundary>
    );
}

export const metadata = {
    title: "My Profile — Aloma",
    description: "Manage your profile, addresses and orders",
};
