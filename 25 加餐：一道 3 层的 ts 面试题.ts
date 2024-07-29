/**
 * 
 * 
 * 这道题有 3 个层次，我们一层层来看。
    第一层的要求是这样的：
    实现一个 zip 函数，对两个数组的元素按顺序两两合并，比如输入 [1,2,3], [4,5,6] 时，
    返回 [[1,4], [2,5],[3,6]]
 */
function zip(arr1: [], arr2: []) {
  const res = [];
  const minLen = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < minLen; i++) res.push([arr1[i], arr2[i]]);
  return res;
}

/**
 * 
    第二层要求：
    给这个 zip 函数定义 ts 类型
 */
interface Zip<T = unknown> {
  (arr1: T[], arr2: T[]): Array<[T, T]>;
}
function zipTs<T = unknown>(arr1: T[], arr2: T[]): Array<[T, T]> {
  const res: Array<[T, T]> = [];
  const minLen = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < minLen; i++) res.push([arr1[i], arr2[i]]);

  return res;
}
const zipTs2: Zip = <T = unknown>(arr1: T[], arr2: T[]): Array<[T, T]> => [
  [arr1[0], arr2[0]],
];

/**
    第三层就上了难度了：
    用类型编程实现精确的类型提示，比如参数传入 [1,2,3], [4,5,6]，那返回值的类型要提示出 [[1,4], [2,5],[3,6]]
    这里要求返回值类型是精确的，我们就要根据参数的类型来动态生成返回值类型
 */

type Zip2<
  Arr1 extends unknown[],
  Arr2 extends unknown[],
  Result extends unknown[] = []
> = Result["length"] extends Arr1["length"]
  ? Result
  : Result["length"] extends Arr2["length"]
  ? Result
  : Zip2<
      Arr1,
      Arr2,
      [...Result, [Arr1[Result["length"]], Arr2[Result["length"]]]]
    >;
type Zip2Test = Zip2<[1, 2, 3, 8], [4, 5, 6]>;

function zip2Ts<T1 extends unknown[], T2 extends unknown[]>(
  arr1: T1,
  arr2: T2
): Zip2<T1, T2> {
  const res = [];
  const minLen = Math.min(arr1.length, arr2.length);
  for (let i = 0; i < minLen; i++) res.push([arr1[i], arr2[i]]);

  return res as Zip2<T1, T2>;
}
const zip2TsTest = zip2Ts([1, 2, 3, 8] as const, [4, 5, 6] as const);
export {};
