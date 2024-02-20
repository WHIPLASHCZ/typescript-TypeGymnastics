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

/**
 * 函数
 */

// GetParameters 获取函数的参数类型
type GetParameters<T extends Function> = T extends (...args: infer P) => unknown
  ? P
  : never;
let gp: GetParameters<(a: string | number) => void>;

// GetReturnType 获取函数的返回值类型
type GetReturnType<T extends Function> = T extends (
  ...args: unknown[]
) => infer R
  ? R
  : never;
let gr: GetReturnType<() => string | number>;

// 获取函数内的this的类型() GetThisParameterType
class Dong {
  name: string;
  constructor() {
    this.name = "dong";
  }
  // 在方法声明时 指定 this 的类型
  hello(this: Dong) {
    return "hello, I'm " + this.name;
  }
}
const d = new Dong();
type GetThisParameterType<T> = T extends (
  this: infer THIS,
  ...args: any[]
) => any
  ? THIS
  : never;
// 若方法声明时指定了 this 的类型 则返回指定时this的类型；
// 若方法声明时没有指定this的类型，则返回unknown；
let gtp: GetThisParameterType<typeof d.hello>;

/**
 * 构造器
 */

// GetInstanceType 获取类返回到实例对象的类型
interface Person {
  name: string;
}
//用interface声明类的类型
interface PersonConstructor {
  new (name: string): Person;
}
//用type声明类的类型
type PersonConstructor2 = new (name: string) => Person;

class PersonClass implements Person {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const person: Person = new PersonClass("李建国");
const personClass: PersonConstructor = PersonClass;
const personClass2: PersonConstructor2 = PersonClass;

// 获取类返回到实例对象的类型
type GetInstanceType<T extends new (...args: any) => any> = T extends new (
  ...args: any
) => infer I
  ? I
  : never;
let gi: GetInstanceType<typeof PersonClass>;
let gi2: GetInstanceType<PersonConstructor>;

// GetConstructorParameters 提取构造器的参数类型
type GetConstructorParameters<T extends new (...args: any) => any> =
  T extends new (...args: infer A) => any ? A : never;
let gpt: GetConstructorParameters<typeof PersonClass>; //[name:string]

/**
 * 索引类型
 */

// GetRefProps 提取 ref 的值的类型
type GetRefProps<T extends object> = T extends { ref: infer R } ? R : never;
let grp: GetRefProps<{ ref: "1" }>;
