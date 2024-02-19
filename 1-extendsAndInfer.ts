/**
 * 数组类型
 */
// 数组类型提取第一个元素
type First<T extends any[]> = T extends [infer F, ...unknown[]] ? F : never;
let f: First<[1]>; // 1

// 提取数组最后一个元素
type Last<T extends any[]> = T extends [...unknown[], infer L] ? L : never;
let l: Last<[1, 2]>; //2

// [].pop 去掉了最后一个元素的数组
type PopArr<T extends any[]> = T extends [...infer Rest, unknown]
  ? Rest
  : never;
let p: PopArr<[1, 2, 3]>; //[1,2]

// [].shift 去掉了第一个元素的数组
type ShiftArr<T extends any[]> = T extends [unknown, ...infer Rest]
  ? Rest
  : never;
let s: ShiftArr<[1, 2, 3]>; //[2,3]

/**
 * 字符串类型
 */

// 判断字符串是否以某个前缀开头
type StartsWith<
  Str extends string,
  Prefix extends string
> = Str extends `${Prefix}${infer R}` ? true : false;
let sw: StartsWith<"abc", "a">;

// 字符串替换：
// Prefix和Suffix这两个infer有可能是空串，如果被替换的字符串Replaced处于开头或结尾；
type Replace<
  Str extends string,
  Replaced extends string,
  Replace extends string
> = Str extends `${infer Prefix}${Replaced}${infer Suffix}`
  ? `${Prefix}${Replace}${Suffix}`
  : never;
let re: Replace<"abc", "a", "z">;

// 去掉左右侧空白字符Trim
type TrimLeft<S extends string> = S extends `${" " | "\n" | "\t"}${infer R}`
  ? TrimLeft<R>
  : S;
type TrimRight<S extends string> = S extends `${infer R}${" " | "\n" | "\t"}`
  ? TrimRight<R>
  : S;
type Trim<S extends string> = TrimLeft<TrimRight<S>>;
let trim: Trim<`  a b c  `>;
