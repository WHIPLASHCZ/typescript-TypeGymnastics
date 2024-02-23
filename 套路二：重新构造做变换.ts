/**
 *  数组类型的重新构造
 */
// 1、Push
type Push<Arr extends any[], Ele> = [...Arr, Ele];
let push: Push<[1, 2, 3], 4>;

// 2、Unshift
type Unshift<Arr extends any[], Ele> = [Ele, ...Arr];
let unshift: Unshift<[1, 2, 3], 4>;

//3、Zip
// 将 [1,2]、['guang', 'dong']合并为：[[1, 'guang'], [2, 'dong']];
type Zip<Arr1 extends any[], Arr2 extends any[]> = Arr1 extends [
  infer Current1,
  ...infer Rest1
]
  ? Arr2 extends [infer Current2, ...infer Rest2]
    ? [[Current1, Current2], ...Zip<Rest1, Rest2>]
    : []
  : [];

let tuple3: Zip<[1, 2, 3], ["guang", "dong", "ren"]>;

/**
 * 字符串类型的重新构造
 */
// CapitalizeStr首字母大写
type CapitalizeStr<Str extends string> =
  Str extends `${infer First}${infer Other}`
    ? `${Uppercase<First>}${Other}`
    : never;
let cap: CapitalizeStr<"abcd">;

// CamelCase dong_dong_dong 到 dongDongDong
type CamelCase<Str extends string> =
  Str extends `${infer A}_${infer B}${infer Other}`
    ? `${A}${Capitalize<B>}${CamelCase<Other>}`
    : Str;
let camel: CamelCase<"dong_dong_dong_dong_dong">;

// DropSubStr 删除字符串中的某个子串
type DropSubStr<
  Str extends string,
  SubStr extends string
> = Str extends `${infer Prefix}${SubStr}${infer Suffix}`
  ? DropSubStr<`${Prefix}${Suffix}`, SubStr>
  : Str;
let dropSupStr: DropSubStr<`abbbc`, "b">;

/**
 * 函数类型的重新构造：
 */
// AppendArgument 在已有的函数类型上添加一个参数
type AppendArgument<F extends (...args: any[]) => any, NewArg> = F extends (
  ...args: infer A
) => infer ReturnType
  ? (...args: [...A, NewArg]) => ReturnType
  : never;
let append: AppendArgument<(a: string) => void, number>;
/**
 * 索引类型的重新构造
 */

// UppercaseKey 把索引类型的 Key 变为大写。
type UppercaseKey<Obj extends object> = {
  [Key in keyof Obj as Uppercase<string & Key>]: Obj[Key];
};
type uppercase = UppercaseKey<{ aa: 1; bb: 2 }>;

// ToReadonly 将索引类型内属性都变只读
type ToReadonly<Obj extends object> = {
  readonly [Key in keyof Obj]: Obj[Key];
};
type readonly = ToReadonly<{ aa: 1; bb: 2 }>;

// ToPartial 将索引类型内属性都变可选
type ToPartial<Obj extends object> = {
  [Key in keyof Obj]?: Obj[Key];
};
type partial = ToPartial<{ aa: 1; bb: 2 }>;

// ToMutable 所有只读属性变成可变属性
type ToMutable<Obj extends object> = {
  -readonly [Key in keyof Obj]: Obj[Key];
};
type mutable = ToMutable<{ readonly a: string }>;

// ToRequired 去掉可选修饰符
type ToRequired<Obj extends object> = {
  [Key in keyof Obj]-?: Obj[Key];
};
type required = ToRequired<{ a?: string }>;

// FilterByValueType 根据值的类型做过滤
type FilterByValueType<Obj extends object, ValueType> = {
  // never 的索引会在生成新的索引类型时被去掉
  [Key in keyof Obj as Obj[Key] extends ValueType ? Key : never]: Obj[Key];
};
type filterVal = FilterByValueType<{ a: number; b: string }, string>;
type filterVal2 = FilterByValueType<
  { a: number; b: string; c: boolean },
  string | number
>;
