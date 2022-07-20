import { createIdGetter } from "../utils";

export interface CountBlockState {
  value: number;
  position: number;
}

export const getId = createIdGetter();

const countRecord: Record<string, CountBlock> = {};

export class CountBlock {
  static of(data: CountBlockState) {
    return new CountBlock(data);
  }

  static findById(id: string): CountBlock | undefined {
    return countRecord[id];
  }

  static delete(id: string) {
    delete countRecord[id];
  }

  public readonly id = getId();
  value: number;
  position: number;
  constructor(data: CountBlockState) {
    this.value = data.value;
    this.position = data.position;
  }

  destroy() {
    return CountBlock.delete(this.id);
  }
}
