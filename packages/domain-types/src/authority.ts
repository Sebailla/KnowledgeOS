export type AuthorityScope =
  | "master-library"
  | "local-library"
  | "personal-knowledge"
  | "canonical-publication"
  | "derived"
  | "external"
  | "operational";

export type AuthorityKind =
  | "system"
  | "user"
  | "publication-source"
  | "provider"
  | "external-authority"
  | "none";

export interface AuthorityDescriptor {
  readonly scope: AuthorityScope;
  readonly kind: AuthorityKind;
  readonly authorityId?: string;
}

export function isAuthoritative(scope: AuthorityScope): boolean {
  return (
    scope === "master-library" ||
    scope === "local-library" ||
    scope === "personal-knowledge" ||
    scope === "canonical-publication"
  );
}

export function isDerivedAuthority(scope: AuthorityScope): boolean {
  return scope === "derived" || scope === "operational";
}
