type aa<T> = T extends `hello-${infer S}` ? S : never;
type ObjWithVal<T> = T extends { value: infer V } ? V : never;
type ObjWithVal2<T> = keyof T extends "value"
  ? T extends { value: infer V }
    ? V
    : never
  : never;
let v: ObjWithVal<{ value: "v" }>;
