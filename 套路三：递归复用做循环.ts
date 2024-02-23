import type { Equal } from "./utils";
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
let buildarr: BuildArray<10, "a">;

/**
 * 字符串类型的递归
 */

// ReplaceAll 替换所有指定字符
type ReplaceAll<
  S extends string,
  Replaced extends string,
  Replacer extends string
> = S extends `${infer Prefix}${Replaced}${infer Suffix}`
  ? ReplaceAll<`${Prefix}${Replacer}${Suffix}`, Replaced, Replacer>
  : S;
let replaceall: ReplaceAll<`abbbaaabbbabbabab`, "b", "c">;

// StringToUnion 把字符串字面量类型的每个字符都提取出来组成联合类型
type StringToUnion<
  S extends string,
  Result = never
> = S extends `${infer First}${infer Rest}`
  ? StringToUnion<Rest, Result | First>
  : Result;

type StringToUnion2<S extends string> = S extends `${infer First}${infer Rest}`
  ? First | StringToUnion2<Rest>
  : never;
let stringToUnion: StringToUnion<"abcdc">;
let stringToUnion2: StringToUnion2<"abcdc">;

// ReverseStr
type ReverseStr<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseStr<Rest>}${First}`
  : S;
let reverseStr: ReverseStr<`abcdefg`>;

/**
 * 对象类型的递归
 */

// DeepReadonly 所有属性全部只读化
type DeepReadonly<O extends Record<PropertyKey, any>> = {
  readonly [Key in keyof O]: O[Key] extends Record<PropertyKey, any>
    ? DeepReadonly<O[Key]>
    : O[Key];
};
type deepreadonly = DeepReadonly<{
  a: {
    b: {
      c: {};
    };
  };
}>;
let dro: deepreadonly = { a: { b: { c: {} } } };
// dro.a.b.c=1; //报错，c是只读
