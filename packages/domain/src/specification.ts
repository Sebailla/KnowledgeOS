export interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean;
}

export class PredicateSpecification<T>
implements Specification<T> {
  public constructor(
    private readonly predicate: (candidate: T) => boolean,
  ) {}

  public isSatisfiedBy(candidate: T): boolean {
    return this.predicate(candidate);
  }
}

export class AndSpecification<T>
implements Specification<T> {
  public constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>,
  ) {}

  public isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) &&
      this.right.isSatisfiedBy(candidate);
  }
}

export class OrSpecification<T>
implements Specification<T> {
  public constructor(
    private readonly left: Specification<T>,
    private readonly right: Specification<T>,
  ) {}

  public isSatisfiedBy(candidate: T): boolean {
    return this.left.isSatisfiedBy(candidate) ||
      this.right.isSatisfiedBy(candidate);
  }
}

export class NotSpecification<T>
implements Specification<T> {
  public constructor(
    private readonly inner: Specification<T>,
  ) {}

  public isSatisfiedBy(candidate: T): boolean {
    return !this.inner.isSatisfiedBy(candidate);
  }
}
