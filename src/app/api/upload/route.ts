import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        folder: "aloma/avatars",
                        transformation: [
                            { width: 400, height: 400, crop: "fill", gravity: "face" },
                            { quality: "auto", fetch_format: "auto" },
                        ],
                    },
                    (error, result) => {
                        if (error || !result) reject(error);
                        else resolve(result as { secure_url: string });
                    }
                )
                .end(buffer);
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (err) {
        console.error("[Upload Error]", err);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
