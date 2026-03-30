import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { razorpay, verifyRazorpaySignature } from "@/lib/razorpay";
import { createShiprocketOrder } from "@/lib/shiprocket";
import { db } from "@/db";
import { order, orderItem, address, product, user, shipment } from "@/db/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const cartRouter = createTRPCRouter({
  // 1. Create Razorpay Order
  createRazorpayOrder: protectedProcedure
    .input(z.object({ amount: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const razorpayOrder = await razorpay.orders.create({
          amount: Math.round(input.amount * 100), // Amount in paise
          currency: "INR",
          receipt: `receipt_${nanoid(10)}`,
        });

        return {
          id: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          key: process.env.RAZORPAY_KEY_ID,
        };
      } catch (error) {
        console.error("Razorpay Order Creation Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create Razorpay order",
        });
      }
    }),

  // 2. Place Order (COD or Verified Prepaid)
  placeOrder: protectedProcedure
    .input(
      z.object({
        addressId: z.string(),
        paymentMethod: z.enum(["prepaid", "cod"]),
        items: z.array(
          z.object({
            id: z.string(),
            quantity: z.number(),
            price: z.string(),
            name: z.string(),
          })
        ),
        totalAmount: z.number(),
        razorpayPaymentId: z.string().optional(),
        razorpayOrderId: z.string().optional(),
        razorpaySignature: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { addressId, paymentMethod, items, totalAmount } = input;

      // Verification for prepaid orders
      if (paymentMethod === "prepaid") {
        if (!input.razorpayOrderId || !input.razorpayPaymentId || !input.razorpaySignature) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Missing Razorpay payment details for prepaid order",
          });
        }

        const isValid = verifyRazorpaySignature(
          input.razorpayOrderId,
          input.razorpayPaymentId,
          input.razorpaySignature
        );

        if (!isValid) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid payment signature",
          });
        }
      }

      // 1. Create Order in DB
      const [newOrder] = await db
        .insert(order)
        .values({
          userId: ctx.userId,
          addressId,
          totalAmount: totalAmount.toString(),
          paymentMethod,
          status: paymentMethod === "prepaid" ? "paid" : "pending",
          razorpayOrderId: input.razorpayOrderId,
          razorpayPaymentId: input.razorpayPaymentId,
        })
        .returning();

      // 2. Create Order Items in DB
      await db.insert(orderItem).values(
        items.map((item) => ({
          orderId: newOrder.id,
          productId: item.id,
          quantity: item.quantity.toString(),
          price: item.price,
        }))
      );

      // 3. Trigger Shiprocket (Background or Sync)
      try {
        const [addr] = await db.select().from(address).where(eq(address.id, addressId));
        const [userData] = await db.select().from(user).where(eq(user.id, ctx.userId));

        if (addr && userData) {
            const shiprocketResponse = await createShiprocketOrder({
                id: newOrder.id,
                customerName: addr.fullName,
                address: addr.addressLine,
                city: addr.city,
                state: addr.state,
                pincode: addr.pincode,
                phone: addr.phone,
                email: userData.email,
                items: items,
                paymentMethod,
                totalAmount,
            });

            // If Shiprocket order created successfully, save stats
            console.log("Shiprocket Order Created:", shiprocketResponse);
            
            if (shiprocketResponse && shiprocketResponse.order_id) {
                await db.insert(shipment).values({
                    orderId: newOrder.id,
                    shiprocketOrderId: shiprocketResponse.order_id.toString(),
                    shiprocketShipmentId: shiprocketResponse.shipment_id?.toString(),
                    status: "processing",
                });
            }
        }
      } catch (shipError) {
        console.error("Shiprocket Integration Error (Non-blocking):", shipError);
      }

      return { success: true, orderId: newOrder.id };
    }),
});
