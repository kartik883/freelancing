import { OrderDetailView } from "@/profile/views/order-detail-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function OrderDetailPage({ params }: PageProps) {
    const { id } = await params;
    return <OrderDetailView orderId={id} />;
}
