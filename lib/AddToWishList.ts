import { WishItem } from "@/Types/types";

export const handleAddItemToWishList = (
    event: React.MouseEvent,
    product: WishItem,
    toggleWishList: (item: WishItem) => void
  ) => {
    event.preventDefault(); // Prevent navigation
    event.stopPropagation(); // Stop event from bubbling up to parent elements

    if (!product?.id) return;

    toggleWishList({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };