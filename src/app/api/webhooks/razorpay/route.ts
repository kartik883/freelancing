import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { db } from "@/db";
import { order, orderItem, address, user, shipment, product } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { createShiprocketOrder } from "@/lib/shiprocket";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  const isValid = verifyWebhookSignature(body, signature, secret);

  if (!isValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const razorpayOrderId = payment.order_id;

    // 1. Find the order in our DB
    const [existingOrder] = await db
      .select()
      .from(order)
      .where(eq(order.razorpayOrderId, razorpayOrderId));

    if (existingOrder && existingOrder.status !== "paid") {
      // 2. Update order status to paid
      await db
        .update(order)
        .set({
          status: "paid",
          razorpayPaymentId: payment.id,
        })
        .where(eq(order.id, existingOrder.id));

      // 3. Trigger Shiprocket if not already done
      try {
        const [addr] = await db.select().from(address).where(eq(address.id, existingOrder.addressId));
        const [userData] = await db.select().from(user).where(eq(user.id, existingOrder.userId));
        const items = await db
          .select({
            productId: orderItem.productId,
            quantity: orderItem.quantity,
            price: orderItem.price,
            name: product.name,
          })
          .from(orderItem)
          .innerJoin(product, eq(orderItem.productId, product.id))
          .where(eq(orderItem.orderId, existingOrder.id));

        if (addr && userData) {
          const shiprocketResponse = await createShiprocketOrder({
            id: existingOrder.id,
            customerName: addr.fullName,
            address: addr.addressLine,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode,
            phone: addr.phone,
            email: userData.email,
            items: items.map(item => ({
                id: item.productId,
                quantity: parseInt(item.quantity),
                price: item.price,
                name: item.name
            })),
            paymentMethod: existingOrder.paymentMethod,
            totalAmount: parseFloat(existingOrder.totalAmount),
          });

          if (shiprocketResponse && shiprocketResponse.order_id) {
            await db.insert(shipment).values({
                orderId: existingOrder.id,
                shiprocketOrderId: shiprocketResponse.order_id.toString(),
                shiprocketShipmentId: shiprocketResponse.shipment_id?.toString(),
                status: "processing",
            });
          }
        }
      } catch (error) {
        console.error("Webhook Shiprocket Error:", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
