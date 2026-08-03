export function levenshteinDistance(
  left: string,
  right: string,
): number {
  const a = [...left.normalize("NFKC").toLowerCase()];
  const b = [...right.normalize("NFKC").toLowerCase()];

  const previous =
    Array.from(
      { length: b.length + 1 },
      (_, index) => index,
    );

  for (let i = 1; i <= a.length; i += 1) {
    const current = [i];

    for (let j = 1; j <= b.length; j += 1) {
      const substitution =
        previous[j - 1]! +
        (a[i - 1] === b[j - 1] ? 0 : 1);

      current[j] =
        Math.min(
          previous[j]! + 1,
          current[j - 1]! + 1,
          substitution,
        );
    }

    for (let j = 0; j < current.length; j += 1) {
      previous[j] = current[j]!;
    }
  }

  return previous[b.length]!;
}

export function normalizedSimilarity(
  left: string,
  right: string,
): number {
  const maximum =
    Math.max(
      [...left].length,
      [...right].length,
    );

  if (maximum === 0) {
    return 1;
  }

  return (
    1 -
    levenshteinDistance(left, right) /
      maximum
  );
}
