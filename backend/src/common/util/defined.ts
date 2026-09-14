/**
 * Drop keys whose value is `undefined`.
 *
 * `class-transformer` (via the global ValidationPipe, `exposeUnsetFields: true`)
 * materialises optional DTO fields that weren't sent as `undefined` own
 * properties. Feeding those straight into `doc.set()` would clear the stored
 * values, turning a partial PATCH into a destructive one.
 */
export function definedOnly<T extends object>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) out[key as keyof T] = value as T[keyof T];
  }
  return out;
}
