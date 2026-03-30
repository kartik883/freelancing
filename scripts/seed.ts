import { db } from "../src/db";
import { product, productImages, review, user } from "../src/db/schema";
import { nanoid } from "nanoid";
import "dotenv/config";

async function seed() {
    console.log("Seeding detailed database...");

    // Create a demo user for reviews
    const demoUserId = nanoid();
    await db.insert(user).values({
        id: demoUserId,
        name: "Elena Vance",
        email: "elena@example.com",
        image: "https://i.pravatar.cc/150?u=elena",
    }).onConflictDoNothing();

    const demoProducts = [
        {
            id: "lumina-glow",
            name: "Lumina Glow Elixir",
            description: "A lightweight, radiance-boosting serum infused with Vitamin C and botanical extracts for a natural, healthy glow.",
            price: "$78.00",
            image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop",
            stock: "50",
            categoryId: "serums",
            howToUse: "1. Cleanse your skin thoroughly with a gentle cleanser.\n2. Apply 3-4 drops of Lumina Glow Elixir to your fingertips.\n3. Gently pat into face and neck until fully absorbed.\n4. Use morning and night followed by moisturizer and SPF (morning).",
        },
        {
            id: "hydra-silk",
            name: "Hydra-Silk Cream",
            description: "Deeply nourishing moisturizer that provides 24-hour hydration and leaves your skin feeling silky-smooth.",
            price: "$65.00",
            image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=1000&auto=format&fit=crop",
            stock: "40",
            categoryId: "moisturizers",
            howToUse: "Smooth a small amount over face and neck after serum. Best used as the final step in your evening ritual.",
        }
    ];

    for (const p of demoProducts) {
        await db.insert(product).values(p).onConflictDoUpdate({
            target: product.id,
            set: { howToUse: p.howToUse }
        });

        // Add extra images for the gallery
        await db.insert(productImages).values([
            { id: nanoid(), productId: p.id, url: "https://images.unsplash.com/photo-1556227702-d1e4e7b5c232?q=80&w=1000" },
            { id: nanoid(), productId: p.id, url: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=1000" }
        ]).onConflictDoNothing();

        // Add a review
        await db.insert(review).values({
            id: nanoid(),
            productId: p.id,
            userId: demoUserId,
            rating: "5",
            comment: "This is the best skincare product I have ever used. My skin has never looked more radiant and healthy. Highly recommend!"
        }).onConflictDoNothing();
    }

    console.log("Detailed seeding completed!");
}

seed().catch((err) => {
    console.error("Seeding failed:", err);
    process.exit(1);
});
