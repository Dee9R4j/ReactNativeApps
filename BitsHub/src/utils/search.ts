/**
 * Search utility for fuzzy filtering
 */
export const fuzzySearch = (query: string, text: string): boolean => {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();

  if (q.length === 0) return true;
  if (t.includes(q)) return true;

  // Simple fuzzy: check if all chars appear in order
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
};
