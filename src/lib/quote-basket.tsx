import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type BasketItem = { slug: string; sku: string; name: string; qty: number; note?: string };
type Ctx = {
  items: BasketItem[];
  count: number;
  add: (item: Omit<BasketItem, "qty">, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  setNote: (slug: string, note: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
};

const KEY = "ags-quote-list-v1";
const BasketContext = createContext<Ctx | null>(null);

export function QuoteBasketProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BasketItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw) as BasketItem[]);
    } catch {
      /* storage unavailable: list lives in memory only */
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = useCallback<Ctx["add"]>((item, qty = 1) => {
    setItems((list) => (list.some((i) => i.slug === item.slug) ? list.map((i) => (i.slug === item.slug ? { ...i, qty: Math.min(999, i.qty + qty) } : i)) : [...list, { ...item, qty }].slice(0, 100)));
  }, []);
  const setQty = useCallback<Ctx["setQty"]>((slug, qty) => setItems((l) => l.map((i) => (i.slug === slug ? { ...i, qty: Math.max(1, Math.min(999, qty || 1)) } : i))), []);
  const setNote = useCallback<Ctx["setNote"]>((slug, note) => setItems((l) => l.map((i) => (i.slug === slug ? { ...i, note: note.slice(0, 300) } : i))), []);
  const remove = useCallback<Ctx["remove"]>((slug) => setItems((l) => l.filter((i) => i.slug !== slug)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<Ctx>(
    () => ({ items, count: items.reduce((n, i) => n + i.qty, 0), add, setQty, setNote, remove, clear, has: (slug) => items.some((i) => i.slug === slug) }),
    [items, add, setQty, setNote, remove, clear],
  );
  return <BasketContext.Provider value={value}>{children}</BasketContext.Provider>;
}

export function useQuoteBasket() {
  const ctx = useContext(BasketContext);
  if (!ctx) throw new Error("useQuoteBasket must be used inside QuoteBasketProvider");
  return ctx;
}
