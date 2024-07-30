import type * as M from "./套路四：数组长度做计数";
declare global {
  namespace Utils {
    export type UnionToIntersection<U> = (
      U extends U ? (x: U) => any : never
    ) extends (x: infer R) => any
      ? R
      : never;
    export type Copy<Obj extends Record<string, any>> = {
      [Key in keyof Obj]: Obj[Key];
    };
    export type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
      T
    >() => T extends B ? 1 : 2
      ? true
      : false;
  }
  namespace MathUtil {
    export type * from "./套路四：数组长度做计数";
  }
}

export {};
