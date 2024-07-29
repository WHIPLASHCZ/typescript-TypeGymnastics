declare global {
  namespace Utils {
    type UnionToIntersection<U> = (
      U extends U ? (x: U) => any : never
    ) extends (x: infer R) => any
      ? R
      : never;
    type Copy<Obj extends Record<string, any>> = {
      [Key in keyof Obj]: Obj[Key];
    };
    type IsEqual<A, B> = (<T>() => T extends A ? 1 : 2) extends <
      T
    >() => T extends B ? 1 : 2
      ? true
      : false;
  }
}

export {};
