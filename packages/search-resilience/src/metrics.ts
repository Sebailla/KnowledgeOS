export interface SearchLatencySample {
  readonly stage: string;
  readonly durationMilliseconds: number;
  readonly success: boolean;
}

export class SearchLatencyMetrics {
  private readonly samples:
    SearchLatencySample[] = [];

  record(sample: SearchLatencySample): void {
    this.samples.push(sample);
  }

  summary(stage: string) {
    const values = this.samples
      .filter((sample) => sample.stage === stage)
      .map((sample) => sample.durationMilliseconds)
      .sort((a, b) => a - b);

    if (values.length === 0) {
      return {
        count: 0,
        minimum: 0,
        maximum: 0,
        average: 0,
        p95: 0,
      };
    }

    const p95Index =
      Math.min(
        values.length - 1,
        Math.ceil(values.length * 0.95) - 1,
      );

    return {
      count: values.length,
      minimum: values[0],
      maximum: values[values.length - 1],
      average:
        values.reduce((sum, value) => sum + value, 0) /
        values.length,
      p95: values[p95Index],
    };
  }
}
