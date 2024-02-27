// Camelcase
type Camelcase<S extends string> =
  S extends `${infer Left}_${infer Right}${infer Rest}`
    ? `${Left}${Uppercase<Right>}${Camelcase<Rest>}`
    : S;
type cmcsunion = Camelcase<"aaa_bbb_ccc" | "dd_ee_ff">;

// IsUnion
// A extends A 这段看似没啥意义，主要是为了触发分布式条件类型，让 A 的每个类型单独传入。
/**
 * A extends A 这种写法是为了触发分布式条件类型，让每个类型单独传入处理的，没别的意义。
 * A extends A 和 [A] extends [A] 是不同的处理，前者是单个类型和整个类型做判断，后者两边都是整个联合类型，因为只有 extends 左边直接是类型参数才会触发分布式条件类型。
 */
type IsUnion<A, B = A> = A extends A ? ([B] extends [A] ? false : true) : never;
let isUnion: IsUnion<["a"] | ["b"]>;
let isUnion2: IsUnion<"aaa">;

// BEM
// bem 是 css 命名规范，用 block__element--modifier 的形式来描述某个区块下面的某个元素的某个状态的样式。
// 那么我们可以写这样一个高级类型，传入 block、element、modifier，返回构造出的 class 名

// 用array[number]这样的方式把数组转换为联合类型；
type BEM<
  Block extends string,
  Element extends string[],
  Modifiers extends string[]
> = `${Block}__${Element[number]}--${Modifiers[number]}`;
type bemResult = BEM<"guang", ["aaa", "bbb"], ["warning", "success"]>;

// AllCombinations
// 任何两个类型的组合有四种：A、B、AB、BA
type Combination<A extends string, B extends string> =
  | A
  | B
  | `${A}${B}`
  | `${B}${A}`;
/**
 * 
类型参数 A、B 是待组合的两个联合类型，B 默认是 A 也就是同一个。
A extends A 的意义就是让联合类型每个类型单独传入做处理，上面我们刚学会。
A 的处理就是 A 和 B 中去掉 A 以后的所有类型组合，也就是 Combination<A, B 去掉 A 以后的所有组合>。
而 B 去掉 A 以后的所有组合就是 AllCombinations<Exclude<B, A>>，
所以全组合就是 Combination<A, AllCombinations<Exclude<B, A>>>。
 */
type AllCombinations<A extends string, B extends string = A> = A extends A
  ? Combination<A, AllCombinations<Exclude<B, A>>>
  : never;
type allcom = AllCombinations<"a" | "b" | "c">;

// 在A集合中去掉B
// 在TypeScript中，当extends关键字左侧是泛型且传入的是联合类型时，它可以实现分配效果，即对联合类型中的每个类型分别进行处理。
type MyExclude<A, B> = A extends B ? never : A;
type ObjectExclude<A extends object, B extends object> = {
  [Key in keyof A as Key extends keyof B ? never : Key]: A[Key];
};
type testMyExclude = MyExclude<"a" | "b" | "c", "a" | "b">;
type testObjExclude = ObjectExclude<
  { a: string; b: number; c: boolean },
  { b: number }
>;

// type zz = { a: string; b: number } extends { a: string } ? true : false; //true

// 当extends关键字左侧不是泛型，是一个确定的联合类型，这样的情况下并不会对左侧联合类型中的每个类型分别进行处理
type aa = "a" | "b" | "c" extends "a" ? true : false; //false
type bb = "a" extends "a" | "b" | "c" ? true : false; //true
