import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { db } from "@/db";
import { curePductImages, product, productImages, videoUpload } from "@/db/schema";
import { desc } from "drizzle-orm";

export const homeRouter = createTRPCRouter({
    // Fetch all products with their primary images + cure (hover) images
    getProductsWithImages: baseProcedure.query(async () => {
        const products = await db.select().from(product);
        const primaryImages = await db.select().from(productImages);
        const cureImages = await db.select().from(curePductImages);

        return products.map((p) => ({
            ...p,
            productImage:p.image,
            primaryImages: primaryImages.filter((img) => img.productId === p.id),
            cureImages: cureImages.filter((img) => img.productId === p.id),
        }));
    }),
    getVideoUploads: baseProcedure.query(async () => {
        return await db.select().from(videoUpload).orderBy(desc(videoUpload.createdAt));
    }),
});