import { db } from "@/db";
import { product, productImages, review, user } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { z } from "zod";

const collectionRouter = createTRPCRouter({
    getmany: baseProcedure.query(async () => {
        const products = await db.select().from(product);
        const images = await db.select().from(productImages);

        return products.map((p) => ({
            ...p,
            images: images.filter((img) => img.productId === p.id),
        }));
    }),
    getById: baseProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const mainProduct = await db
                .select()
                .from(product)
                .where(eq(product.id, input.id))
                .then((res) => res[0]);

            if (!mainProduct) return null;

            const images = await db
                .select()
                .from(productImages)
                .where(eq(productImages.productId, input.id));

            const reviews = await db
                .select({
                    id: review.id,
                    rating: review.rating,
                    comment: review.comment,
                    userName: user.name,
                    userImage: user.image,
                })
                .from(review)
                .leftJoin(user, eq(review.userId, user.id))
                .where(eq(review.productId, input.id));

            return {
                ...mainProduct,
                images,
                reviews,
            };
        }),
    getProductImages: baseProcedure
        .input(
            z.object({
                productId: z.string(),
            })
        )
        .query(async ({ input }) => {
            const data = await db
                .select()
                .from(productImages)
                .where(eq(productImages.productId, input.productId));

            return data;
        }),
});

export default collectionRouter;