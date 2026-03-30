import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { db } from "@/db";
import { user, address, order, orderItem, product } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const profileRouter = createTRPCRouter({
    // Get current logged-in user info + addresses + orders
    getMe: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.userId;

        const [me] = await db.select().from(user).where(eq(user.id, userId));
        const addresses = await db.select().from(address).where(eq(address.userId, userId));
        const orders = await db
            .select({
                id: order.id,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: order.createdAt,
            })
            .from(order)
            .where(eq(order.userId, userId))
            .orderBy(order.createdAt);

        return { user: me ?? null, addresses, orders };
    }),

    // Update name or image
    updateProfile: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1).optional(),
                image: z.string().url().optional(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            await db
                .update(user)
                .set({
                    ...(input.name ? { name: input.name } : {}),
                    ...(input.image ? { image: input.image } : {}),
                    updatedAt: new Date(),
                })
                .where(eq(user.id, ctx.userId));
            return { success: true };
        }),

    // Upsert (create or update) an address
    upsertAddress: protectedProcedure
        .input(
            z.object({
                id: z.string().optional(),
                fullName: z.string().min(1),
                phone: z.string().min(1),
                city: z.string().min(1),
                state: z.string().min(1),
                pincode: z.string().min(1),
                addressLine: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { id, ...fields } = input;
            if (id) {
                await db
                    .update(address)
                    .set(fields)
                    .where(eq(address.id, id));
            } else {
                await db.insert(address).values({
                    ...fields,
                    userId: ctx.userId,
                });
            }
            return { success: true };
        }),

    // Delete an address
    deleteAddress: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            await db
                .delete(address)
                .where(eq(address.id, input.id));
            return { success: true };
        }),
});
