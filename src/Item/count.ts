import { getId } from "../utils";

export interface CountBlockState {
  value: number;
  position: number;
}

export class CountBlock {
  static of(data: CountBlockState) {
    return new CountBlock(data);
  }
  promise: Promise<any> | null = null;
  resolver: ((value: unknown) => void) | null = null;
  public readonly id = getId();
  value: number;
  position: number;
  constructor(data: CountBlockState) {
    this.value = data.value;
    this.position = data.position;
  }
  setState(data: Partial<CountBlockState>) {
    this.promise = new Promise((resolve) => {
      this.resolver = resolve;
    }).then(() => {
      this.promise = null;
      this.resolver = null;
    });
    Object.assign(this, data);
    return this.promise;
  }
}
