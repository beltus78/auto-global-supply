import { AsyncLocalStorage } from "node:async_hooks";
type BackgroundContext = { waitUntil?: (task: Promise<unknown>) => void };
export const backgroundContext = new AsyncLocalStorage<BackgroundContext>();
export function startBackground(task: Promise<unknown>) {
  const ctx = backgroundContext.getStore();
  if (ctx?.waitUntil) ctx.waitUntil(task);
  else void task;
}