export type ArrayElementType<ArrType> =
  ArrType extends readonly (infer ElementType)[] ? ElementType : never;

export interface Block {
  id: string;
  value: number;
  position: number;
}
