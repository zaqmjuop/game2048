import { ArrayElementType } from "./type";

export const includes = <T extends any[] | readonly any[]>(
  val: any,
  ary: T
): val is ArrayElementType<T> => {
  return ary.includes(val);
};
