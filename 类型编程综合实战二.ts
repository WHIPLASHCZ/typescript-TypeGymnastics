/**
 * 函数重载的三种方法
 */
// 1.declare
declare function func(name: string): string;
declare function func(name: number): number;
func("a");
func(1);

// 2.若函数有实现,就不需要declare了.
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: any, b: any) {
  return a + b;
}
const res = add(1, 2);
const res2 = add("a", "b");

// 3.函数可以用 interface 的方式声明，同样，也可以用 interface 的方式声明函数重载：
interface Func {
  (name: string): string;
  (name: number): number;
}
declare const func2: Func;
func2("a");
func2(1);

// 4.函数类型可以取交叉类型(交叉类型表示创建一个满足所有被交叉类型的类型)，也就是多种类型都可以，其实也是函数重载的意思：
type Func2 = ((name: string) => string) & ((name: number) => number);
declare const func3: Func2;
func3("a");
func3(1);

/**
 * UnionToTuple 联合类型转元祖
 */
// 当我们去获取重载函数类型的返回值类型，得到的是重载中最后一个函数的返回值类型。
// 多个函数类型的交叉类型，也被视为函数重载；
// 我们之前实现过联合类型转交叉类型；
// 那么解题思路呼之欲出：将传入UnionToTuple的联合类型转为函数类型的交叉类型，然后取这个交叉类型的返回值结果，取到的就是最后一个被交叉类型的返回值类型；
// 然后将取到的返回值类型放入tuple中，再通过Exclude把联合类型中取过的类型剔除掉，再递归取剩下的；
// 以此类推。

type UnionToFunIntersection<T> = Utils.UnionToIntersection<
  T extends any ? (...args: any) => T : (...args: any) => T
>;

type UnionToTuple<U> = UnionToFunIntersection<U> extends (
  ...args: any
) => infer ReturnType
  ? [...UnionToTuple<Exclude<U, ReturnType>>, ReturnType]
  : [];
type UnionToTupleTest = UnionToTuple<string | number | boolean>;

/**
 * join 接收字符串元组和分隔符，将元组用分隔符拼接为字符串
 */

type JoinType<
  Items extends any[],
  Separator extends string,
  Result extends string = ""
> = Items extends [infer First, ...infer Rest]
  ? JoinType<Rest, Separator, `${Result}${Separator}${First & string}`>
  : Result extends `${infer F}${infer Rest}`
  ? Rest
  : Result;

function join<Separator extends string>(
  separator: Separator
): <Items extends string[]>(...args: Items) => JoinType<Items, Separator>;

function join<Separator extends string>(separator: Separator) {
  return <Items extends string[]>(...args: Items) => args.join(separator);
}

type JoinTypeTest = JoinType<["a", "b", "c", "d"], "-">;
const testJoin = join("&")("a", "b", "c", "d");

/**
 * DeepCamelize 递归的把索引类型的 key 转成 CamelCase 的
 */
type obj = {
  aaa_bbb_eee_fff: string;
  bbb_ccc: [
    {
      ccc_ddd: string;
    },
    {
      ddd_eee: string;
      eee_fff: {
        fff_ggg: string;
      };
    }
  ];
};

type KebabToCamel<Key extends string> =
  Key extends `${infer First}_${infer Rest}`
    ? `${First}${KebabToCamel<Capitalize<Rest>>}`
    : Key;

type KebabToCamelTest = KebabToCamel<"aaa_bbb_eee_fff">;

type DeepCamelize<Obj extends Record<string, any>> = {
  [key in keyof Obj as KebabToCamel<key & string>]: Obj[key] extends Record<
    string,
    any
  >
    ? DeepCamelize<Obj[key]>
    : Obj[key];
};
type IsArrExtendsRecord = [] extends Record<string, any> ? true : false;
type DeepCamelizeTest = DeepCamelize<obj>;
let deepCamelizeTest: DeepCamelizeTest = {
  aaaBbbEeeFff: "",
  bbbCcc: [
    {
      cccDdd: "",
    },
    {
      dddEee: "",
      eeeFff: {
        fffGgg: "",
      },
    },
  ],
};

/**
 * AllKeyPath 需求是拿到一个索引类型的所有 key 的路径组成联合类型
 */
type obj2 = {
  a: {
    b: {
      b1: string;
      b2: string;
    };
    c: {
      c1: string;
      c2: string;
    };
  };
};

// type AllKeyPath<
//   Obj extends Record<string, any>,
//   LeftPath extends string = ""
// > = {
//   [key in keyof Obj]: Obj[key] extends Record<string, any>
//     ? AllKeyPath<
//         Obj[key],
//         LeftPath extends ""
//           ? key & string
//           : LeftPath | `${LeftPath}.${key & string}`
//       >
//     : LeftPath extends ""
//     ? key
//     : LeftPath | `${LeftPath}.${key & string}`;
// }[keyof Obj];
type AllKeyPath<Obj extends Record<string, any>> = {
  [key in keyof Obj]: key extends string
    ? Obj[key] extends Record<string, any>
      ? key | `${key}.${AllKeyPath<Obj[key]>}`
      : key
    : never;
}[keyof Obj];

type AllKeyPathTest = AllKeyPath<obj2>;

/**
 * Defaultize
 * 实现这样一个高级类型，对 A、B 两个索引类型做合并，如果是只有 A 中有的不变，如果是 A、B 都有的就变为可选，只有 B 中有的也变为可选。
 */
type A = {
  aaa: 111;
  bbb: 222;
};
type B = {
  bbb: 222;
  ccc: 333;
};

type Defaultize<
  A extends Record<string, any>,
  B extends Record<string, any>
> = {
  [key in Exclude<keyof A, keyof B>]: A[key];
} & { [key in keyof B]?: B[key] };

type Defaultize2<A, B> = Pick<A, Exclude<keyof A, keyof B>> &
  Partial<Pick<A, Extract<keyof A, keyof B>>> &
  Partial<Pick<B, Exclude<keyof B, keyof A>>>;

type DefaultizeTest = Utils.Copy<Defaultize<A, B>>;
let defaultizeTest: DefaultizeTest = { aaa: 111 };
export {};
