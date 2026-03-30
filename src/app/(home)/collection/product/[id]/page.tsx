import ProductDetailView from "@/collection/views/product-detail-view";

const ProductPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    return (
        <ProductDetailView id={id} />
    );
};

export default ProductPage;
