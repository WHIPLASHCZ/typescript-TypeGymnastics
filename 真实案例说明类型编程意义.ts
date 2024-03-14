type CurriedFunc<Params, Return> = Params extends [infer F, ...infer Rest]
  ? (arg: F) => CurriedFunc<Rest, Return>
  : Return;
const func = (a: string, b: number, c: boolean) => {};
declare function currying<Func>(
  fn: Func
): Func extends (...args: infer Params) => infer Result
  ? CurriedFunc<Params, Result>
  : never;
const curriedFunc = currying(func);
