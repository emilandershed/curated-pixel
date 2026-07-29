import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { cartTotalCents, resolveLinePriceCents, type CartLine } from "@/lib/pricing";

const STORAGE_KEY = "frame.cart.v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  totalCents: number;
  isOpen: boolean;
  hydrated: boolean;
  add: (line: CartLine) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const isValid = (line: unknown): line is CartLine => {
  if (typeof line !== "object" || line === null) return false;
  const candidate = line as CartLine;
  if (candidate.kind !== "album" && candidate.kind !== "bundle") return false;
  if (typeof candidate.id !== "string") return false;
  return resolveLinePriceCents(candidate) !== null;
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed.filter(isValid));
      }
    } catch {
      /* corrupt storage is not worth crashing over */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* private mode */
    }
  }, [lines, hydrated]);

  const add = useCallback((line: CartLine) => {
    setLines((current) => {
      if (current.some((l) => l.id === line.id)) return current;
      // The bundle contains everything, so it replaces individual albums.
      if (line.kind === "bundle") return [line];
      if (current.some((l) => l.kind === "bundle")) return current;
      return [...current, line];
    });
    setOpen(true);
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.length,
      totalCents: cartTotalCents(lines),
      isOpen,
      hydrated,
      add,
      remove,
      clear,
      has: (id: string) => lines.some((l) => l.id === id),
      setOpen,
    }),
    [lines, isOpen, hydrated, add, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
