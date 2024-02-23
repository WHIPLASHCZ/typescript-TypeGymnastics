/**
 * Promise 的递归复用
 */

// 获取Promise内的参数的类型
type DeepPromiseValueType<P> = P extends Promise<infer T>
  ? DeepPromiseValueType<T>
  : P;
type dpvt = DeepPromiseValueType<
  Promise<Promise<Promise<Record<string, any>>>>
>;

/**
 * 数组类型的递归
 */

// ReverseArr 数字翻转
type ReverseArr<Arr extends any[]> = Arr extends [infer First, ...infer Rest]
  ? [...ReverseArr<Rest>, First]
  : Arr;
type arr = ReverseArr<[1, 2, 3, 4, 5]>;

// Includes 查找
type Equal<A, B> = A extends B ? (B extends A ? true : false) : false;
type Includes<Arr extends any[], TargetItem> = Arr extends [
  infer First,
  ...infer Rest
]
  ? Equal<First, TargetItem> extends true
    ? true
    : Includes<Rest, TargetItem>
  : false;
type include = Includes<[11, 22, 33], 22>;

// RemoveItem 删除
type RemoveItem<Arr extends any[], TargetItem> = Arr extends [
  infer First,
  ...infer Rest
]
  ? Equal<First, TargetItem> extends true
    ? RemoveItem<Rest, TargetItem>
    : [First, ...RemoveItem<Rest, TargetItem>]
  : Arr;
type remove = RemoveItem<[11, 22, 22, 33], 22>;

// BuildArray 创建数组
type BuildArray<
  Length extends number,
  Ele = unknown,
  Arr extends unknown[] = []
> = Arr["length"] extends Length ? Arr : BuildArray<Length, Ele, [...Arr, Ele]>;
