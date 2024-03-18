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
