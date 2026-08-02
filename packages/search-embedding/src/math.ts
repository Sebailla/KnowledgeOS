export function vectorMagnitude(
  vector: readonly number[],
): number {
  return Math.sqrt(
    vector.reduce(
      (sum, value) =>
        sum + value * value,
      0,
    ),
  );
}

export function cosineSimilarity(
  left: readonly number[],
  right: readonly number[],
): number {
  if (
    left.length !== right.length
  ) {
    throw new Error(
      "Vector dimensions do not match",
    );
  }

  const leftMagnitude =
    vectorMagnitude(left);
  const rightMagnitude =
    vectorMagnitude(right);

  if (
    leftMagnitude === 0 ||
    rightMagnitude === 0
  ) {
    return 0;
  }

  const dot =
    left.reduce(
      (sum, value, index) =>
        sum +
        value *
        (right[index] ?? 0),
      0,
    );

  return (
    dot /
    (
      leftMagnitude *
      rightMagnitude
    )
  );
}

export function normalizeVector(
  vector: readonly number[],
): readonly number[] {
  const magnitude =
    vectorMagnitude(vector);

  if (magnitude === 0) {
    return vector.map(() => 0);
  }

  return vector.map(
    (value) =>
      value / magnitude,
  );
}
