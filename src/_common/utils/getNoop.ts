export function getNoop(): () => undefined;
export function getNoop(promise: true): () => Promise<void>;
export function getNoop(promise?: boolean) {
  return () => (promise ? Promise.resolve() : undefined);
}
