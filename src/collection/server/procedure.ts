import { db } from "@/db";
import { product, productImages, review, user } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { and, eq, ne, inArray, notInArray } from "drizzle-orm";
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
    .input(
      z.object({
        id: z.string(),
      })
    )
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

  getRelatedProducts: baseProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const currentItem = await db
        .select({
          id: product.id,
          categoryId: product.categoryId,
        })
        .from(product)
        .where(eq(product.id, input.productId))
        .then((res) => res[0]);

      if (!currentItem) return [];

      let relatedItems: typeof product.$inferSelect[] = [];

      // Same category products
      if (currentItem.categoryId) {
        relatedItems = await db
          .select()
          .from(product)
          .where(
            and(
              eq(product.categoryId, currentItem.categoryId),
              ne(product.id, currentItem.id)
            )
          )
          .limit(8);
      }

      // Fallback if fewer than 8
      if (relatedItems.length < 8) {
        const existingIds = [
          currentItem.id,
          ...relatedItems.map((item) => item.id),
        ];

        const fallbackItems = await db
          .select()
          .from(product)
          .where(notInArray(product.id, existingIds))
          .limit(8 - relatedItems.length);

        relatedItems = [...relatedItems, ...fallbackItems];
      }

      if (relatedItems.length === 0) return [];

      const productIds = relatedItems.map((item) => item.id);

      const images = await db
        .select()
        .from(productImages)
        .where(inArray(productImages.productId, productIds));

      return relatedItems.map((item) => ({
        ...item,
        images: images.filter((img) => img.productId === item.id),
      }));
    }),
});

export default collectionRouter;