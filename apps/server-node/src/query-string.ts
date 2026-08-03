export function parseRequestTarget(target: string): {
  readonly path: string;
  readonly query: Readonly<Record<string, string | undefined>>;
} {
  const separator = target.indexOf("?");
  const rawPath =
    separator < 0 ? target : target.slice(0, separator);
  const rawQuery =
    separator < 0 ? "" : target.slice(separator + 1);

  const query: Record<string, string | undefined> = {};

  for (const part of rawQuery.split("&")) {
    if (!part) continue;
    const equals = part.indexOf("=");
    const rawKey = equals < 0 ? part : part.slice(0, equals);
    const rawValue = equals < 0 ? "" : part.slice(equals + 1);
    const key = decodeURIComponent(rawKey.replace(/\+/g, " "));
    const value = decodeURIComponent(
      rawValue.replace(/\+/g, " "),
    );
    query[key] = value;
  }

  return {
    path: decodeURIComponent(rawPath || "/"),
    query,
  };
}
