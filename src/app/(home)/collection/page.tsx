import CollectionView from "@/collection/views/collectionview";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Shop All Rituals | Natural & Chemical-Free Skincare",
    description: "Explore Purastone's full range of natural skincare products. From acne removal to glowing skin rituals, find your perfect chemical-free match.",
};

const Collection = () => {
  return (
    <CollectionView />
  );
};

export default Collection;