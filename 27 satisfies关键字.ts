type Obj = {
  a: string;
  b: number | string;
  c: boolean;
  //   [key: string]: any;
};

// 用Obj这个类型去约束obj2这个变量，但是obj2变量的类型仍然是被自动推导出来的类型。
let obj2 = {
  a: "",
  b: 1,
  c: false,
} satisfies Obj;

export {};
