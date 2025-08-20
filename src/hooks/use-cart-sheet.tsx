"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type CartSheetContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartSheetContext = createContext<CartSheetContextValue | undefined>(
  undefined,
);

export const CartSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, openCart, closeCart, toggleCart }),
    [isOpen],
  );

  return (
    <CartSheetContext.Provider value={value}>
      {children}
    </CartSheetContext.Provider>
  );
};

export const useCartSheet = () => {
  const ctx = useContext(CartSheetContext);
  if (!ctx) {
    throw new Error("useCartSheet must be used within a CartSheetProvider");
  }
  return ctx;
};
