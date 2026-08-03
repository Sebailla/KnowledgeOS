export abstract class ValueObject<TProps extends object> {
  protected constructor(
    protected readonly props: Readonly<TProps>,
  ) {}

  public equals(other: ValueObject<TProps>): boolean {
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  public toJSON(): Readonly<TProps> {
    return this.props;
  }
}
