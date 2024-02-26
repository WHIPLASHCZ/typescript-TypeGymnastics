import type { BuildArray } from "./utils";
/**
 * 数组长度实现加减乘除
 */

// Add 加法
type Add<Num1 extends number, Num2 extends number> = [
  ...BuildArray<Num1>,
  ...BuildArray<Num2>
]["length"];
let sum: Add<1, 3>;

// Subtract 减法
type Subtract<
  Num1 extends number,
  Num2 extends number,
  Result extends any[] = BuildArray<Num1>,
  Times extends any[] = []
> = Times["length"] extends Num2
  ? Result["length"]
  : Result extends [infer First, ...infer Rest]
  ? Subtract<Num1, Num2, Rest, [...Times, unknown]>
  : Result["length"];

type Subtract2<
  Num1 extends number,
  Num2 extends number
> = BuildArray<Num1> extends [...BuildArray<Num2>, ...infer Rest]
  ? Rest["length"]
  : never;

let sub: Subtract<33, 12>;
let sub2: Subtract2<33, 12>;

// Multiply 乘法
type Multiply<
  Num1 extends number,
  Num2 extends number,
  Result extends any[] = [],
  Times extends any[] = []
> = Times["length"] extends Num1
  ? Result["length"]
  : Multiply<Num1, Num2, [...Result, ...BuildArray<Num2>], [...Times, unknown]>;

type Multiply2<
  Num1 extends number,
  Num2 extends number,
  Result extends any[] = []
> = Num2 extends 0
  ? Result["length"]
  : Multiply<Num1, Subtract2<Num2, 1>, [...Result, ...BuildArray<Num1>]>;

let mut: Multiply<6, 5>;
let mut2: Multiply2<6, 5>;

// Divide 除法
type Divide<
  Num1 extends number,
  Num2 extends number,
  Result extends any[] = BuildArray<Num1>,
  Times extends any[] = []
> = Result["length"] extends 0
  ? Times["length"]
  : Result extends [...BuildArray<Num2>, ...infer Rest]
  ? Divide<Num1, Num2, Rest, [...Times, unknown]>
  : Result["length"];

type Divide2<
  Num1 extends number,
  Num2 extends number,
  Times extends any[] = []
> = Num1 extends 0
  ? Times["length"]
  : Divide2<Subtract2<Num1, Num2>, Num2, [...Times, unknown]>;

let divide: Divide<6, 3>;
let divide2: Divide2<12, 3>;

// StrLen 字符串长度
type StrLen<
  Str extends string,
  Counter extends any[] = []
> = Str extends `${infer First}${infer Rest}`
  ? StrLen<Rest, [...Counter, unknown]>
  : Counter["length"];

// GreaterThan 大于
// 我们往一个数组类型中不断放入元素取长度，如果先到了 A，那就是 B 大，否则是 A 大：
type GreaterThan<
  Num1 extends number,
  Num2 extends number,
  CountArr extends unknown[] = []
> = Num1 extends Num2
  ? false
  : CountArr["length"] extends Num1
  ? false
  : CountArr["length"] extends Num2
  ? true
  : GreaterThan<Num1, Num2, [...CountArr, unknown]>;
let gtt: GreaterThan<7, 6>;

// Fibonacci  [i1,i2,i1+i2]
// 1、1、2、3、5、8、13、21、34
type FibonacciLoop<
  Num extends number,
  FirstArr extends any[] = [1],
  CurrentArr extends any[] = [],
  CounterArr extends any[] = []
> = CounterArr["length"] extends Num
  ? CurrentArr["length"]
  : FibonacciLoop<
      Num,
      CurrentArr,
      [...FirstArr, ...CurrentArr],
      [...CounterArr, unknown]
    >;

type Fibonacci<Num extends number> = FibonacciLoop<1>;
