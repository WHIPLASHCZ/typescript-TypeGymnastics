export type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;
export type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>;

//   这样可以判断any；这是因为 TS 对这种形式的类型做了特殊处理，是一种 hack 的写法。
export type IsEqual2<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false;
export type NotEqual<A, B> = IsEqual2<A, B> extends true ? false : true;
