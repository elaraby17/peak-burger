import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEYS, readStorage, writeStorage } from "../utils/storage";

const CartContext = createContext(null);

const DELIVERY_FEE = 25;
const FREE_DELIVERY_THRESHOLD = 300;

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => readStorage(STORAGE_KEYS.CART, []));
  const [justAddedId, setJustAddedId] = useState(null);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.CART, items);
  }, [items]);

  // A cart line is unique per product + chosen size + chosen sauce.
  const buildLineId = (productId, sizeId, sauceId) => `${productId}::${sizeId ?? "std"}::${sauceId ?? "none"}`;

  const addItem = (product, { size, sauce, quantity = 1 } = {}) => {
    const unitPrice = size?.price ?? product.price ?? 0;
    const lineId = buildLineId(product.id, size?.id, sauce);

    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          lineId,
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          category: product.category,
          size: size ?? null,
          sauce: sauce ?? null,
          unitPrice,
          quantity,
        },
      ];
    });

    setJustAddedId(lineId);
    window.setTimeout(() => setJustAddedId(null), 500);
  };

  const removeItem = (lineId) => setItems((prev) => prev.filter((i) => i.lineId !== lineId));

  const increaseQuantity = (lineId) =>
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity + 1 } : i)));

  const decreaseQuantity = (lineId) =>
    setItems((prev) =>
      prev
        .map((i) => (i.lineId === lineId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0)
    );

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0), [items]);
  const deliveryFee = useMemo(() => (items.length === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE), [
    items.length,
    subtotal,
  ]);
  const total = subtotal + deliveryFee;
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        itemCount,
        justAddedId,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
