import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Watches the page for [data-reveal] blocks and .blueprint illustrations and
 * marks them when they scroll into view. Mounted once in the root layout.
 */
export function MotionObserver() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.classList.add(el.classList.contains("blueprint") ? "is-drawn" : "is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
    const scan = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in), .blueprint:not(.is-drawn)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [path]);

  useEffect(() => {
    const header = document.querySelector("header[data-site-header]");
    if (!header) return;
    const onScroll = () => header.setAttribute("data-scrolled", window.scrollY > 40 ? "true" : "false");
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}

/** Counts up to a number when it first scrolls into view. Server render shows the final value. */
export function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / 1400);
        setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]);
  return <span ref={ref} className={className}>{shown.toLocaleString("en-US")}</span>;
}

/** Types out a sequence of phrases in a loop, for the hero search hint. */
export function TypeCycle({ phrases, className }: { phrases: string[]; className?: string }) {
  const [text, setText] = useState(phrases[0] ?? "");
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0, n = phrases[0]?.length ?? 0, del = false, timer = 0;
    const step = () => {
      const p = phrases[i % phrases.length] ?? "";
      if (!del) {
        n++;
        if (n > p.length) { del = true; timer = window.setTimeout(step, 1600); return; }
      } else {
        n--;
        if (n === 0) { del = false; i++; }
      }
      setText((phrases[i % phrases.length] ?? "").slice(0, n));
      timer = window.setTimeout(step, del ? 28 : 55);
    };
    timer = window.setTimeout(step, 1600);
    return () => clearTimeout(timer);
  }, [phrases]);
  return <span className={`cursor-blink ${className ?? ""}`}>{text}</span>;
}
