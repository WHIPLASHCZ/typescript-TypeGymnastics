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
  }
}

export {};
