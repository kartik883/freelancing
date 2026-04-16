import { OrdersView } from "@/profile/views/ordersview";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function OrdersPage() {
    return <OrdersView />;
}
