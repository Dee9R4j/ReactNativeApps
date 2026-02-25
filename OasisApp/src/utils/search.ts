/**
 * Search utility — Fuse.js-like but zero-dependency
 */

/**
 * Simple fuzzy search over an array of objects
 */
export function searchItems<T>(
  items: T[],
  query: string,
  keys: (keyof T)[],
): T[] {
  if (!query.trim()) return items;
  const lowerQuery = query.toLowerCase().trim();

  return items.filter((item) =>
    keys.some((key) => {
      const value = item[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerQuery);
      }
      return false;
    }),
  );
}
