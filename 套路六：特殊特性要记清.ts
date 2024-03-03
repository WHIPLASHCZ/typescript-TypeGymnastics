/**
 * isAny 判断传入的泛型是否为any类型
 */
// any 类型与任何类型的交叉都是 any。(除了never)
// any满足于任何类型，任何类型也满足与any。(除了never)
type isAny<T> = true extends false & T ? true : false;
let isany: isAny<any>;

// any是所有类型的子类型和父类型。(除了never)
let any: any;
let a: "a" = any;
any = a;
// 一个类型不可能同时是never和any。
type NeverAndAny = never & any; //never

/**
 * IsEqual 判断两类型是否相等
 */

// 这样写是有问题的：这样无法判断any，因为any是所有类型的子类型和父类型；
type IsEqual<A, B> = (A extends B ? true : false) &
  (B extends A ? true : false);

//   这样可以判断any；这是因为 TS 对这种形式的类型做了特殊处理，是一种 hack 的写法。
type IsEqual2<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  T
>() => T extends B ? 1 : 2
  ? true
  : false;
type NotEqual<A, B> = IsEqual2<A, B> extends true ? false : true;

/**
 * IsUnion 判断联合类型
 */
// A extends A 是为了触发分布式条件类型，让 A 的每个类型单独传入；
// [B] extends [A] 这样不直接写 B 就可以避免触发分布式条件类型，那么 B 就是整个联合类型。
// B 是联合类型整体，而 A 是单个类型，自然不成立，而其它类型没有这种特殊处理，A 和 B 都是同一个，怎么判断都成立。
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;

// B和A的位置不能反，因为：
type UnionArrExtend = [string] extends [string | number | boolean]
  ? true
  : false; //结果为true;

/**
 * IsNever 判断泛型是否为never
 */
// never 在条件类型中也比较特殊，如果条件类型左边是类型参数，并且传入的是 never，那么直接返回 never;
// 所以，要判断 never 类型，就不能直接 T extends number，可以这样写：
type IsNever<T> = [T] extends [never] ? true : false;
let isnever: IsNever<never>; //true

// 除此以外，any 在条件类型中也比较特殊，如果类型参数为 any，会直接返回 trueType 和 falseType 的合并：
type TestAny<T> = T extends number ? 1 : 2;
let testAny: TestAny<any>; // 1|2

/**
 * IsTuple 判断元组类型
 */

// 元组类型的 length 是数字字面量，而数组的 length 是 number。
type IsTuple<T> = T extends [...infer Eles]
  ? NotEqual<T["length"], number> extends true
    ? true
    : false
  : false;
let istuple: IsTuple<[string, number, number]>; //true
let istuple2: IsTuple<number[]>; //false

/**
 * UnionToIntersection 联合类型转交叉类型
 */
type UnionToIntersection<U> = (
  U extends U ? (x: U) => unknown : never
) extends (x: infer R) => unknown
  ? R
  : never;

let uti: UnionToIntersection<{ name: string } | { age: number }>;

/**
 * GetOptional 提取索引类型中的可选索引
 */
// 这要利用可选索引的特性：可选索引的值为 undefined 和值类型的联合类型。
// 可选的意思是这个索引可能没有，没有的时候，那 Pick<Obj, Key> 就是空的，所以 {} extends Pick<Obj, Key> 就能过滤出可选索引。
// 注意，可选不是值可能是 undefined 的意思,是这个索引可能不存在于对象上
type GetOptional<T extends Record<PropertyKey, any>> = {
  [Key in keyof T as {} extends Pick<T, Key> ? Key : never]: T[Key];
};
type obj = { a?: string };
type getA = Pick<obj, "a">;
type emptyObjWithA = {} extends getA ? true : false; //true

/**
 * GetRequired 提取索引类型中的必选索引
 */
type GetRequired<T extends Record<PropertyKey, any>> = {
  [Key in keyof T as {} extends Pick<T, Key> ? never : Key]: T[Key];
};

/**
 * RemoveIndexSignature
 */
type RemoveIndexSignature<Obj extends Record<string, any>> = {
  [Key in keyof Obj as Key extends `${infer Str}` ? Str : never]: Obj[Key];
};

/**
 * ClassPublicProps
 */
type ClassPublicProps<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key];
};
