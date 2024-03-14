/**
 * KebabCaseToCamelCase 将aa-bb-cc变为aaBbCc
 */
type KebabCaseToCamelCase<KebabCase extends string> =
  KebabCase extends `${infer First}-${infer Rest}`
    ? `${First}${Capitalize<KebabCaseToCamelCase<Rest>>}`
    : Capitalize<KebabCase>;
let testKebabCaseToCamelCase: KebabCaseToCamelCase<`aaa-bbb-ccc-ddd-eee`>;

/**
 * CamelCaseToKebabCase 将aaBbCc变为aa-bb-cc
 */
type CamelCaseToKebabCase<CamelCase extends string> =
  CamelCase extends `${infer First}${infer Rest}`
    ? First extends Uppercase<First>
      ? `-${Lowercase<First>}${CamelCaseToKebabCase<Rest>}`
      : `${First}${CamelCaseToKebabCase<Rest>}`
    : CamelCase;
let testCamelCaseToKebabCase: CamelCaseToKebabCase<`aaaBbbCccDddEee`>;

/**
 * Chunk 将数组切割为每ItemLen一个的二维数组
 */
type Chunk<
  Arr extends unknown[],
  ItemLen extends number,
  CurItem extends unknown[] = [],
  Res extends unknown[] = []
> = Arr extends [infer First, ...infer Rest]
  ? CurItem["length"] extends ItemLen
    ? Chunk<Rest, ItemLen, [First], [...Res, CurItem]>
    : Chunk<Rest, ItemLen, [...CurItem, First], Res>
  : [...Res, CurItem];
let testChunk: Chunk<[1, 2, 3, 4, 5, 6], 2>;

/**
 * TupleToNestedObject 将[‘a’, ‘b’, ‘c’] 的元组类型，再加上值的类型 'xxx' 变为{a:{b:{c:'xxx'}}}
 */

type TupleToNestedObject<Tuple extends unknown[], Value> = Tuple extends [
  infer First,
  ...infer Rest
]
  ? {
      [key in First as key extends PropertyKey
        ? key
        : never]: Rest extends unknown[]
        ? TupleToNestedObject<Rest, Value>
        : Value;
    }
  : Value;
let testTupleToNestedObject: TupleToNestedObject<["aa", "bb", "cc"], string>;

/**
 * PartialObjectPropByKeys 把一个索引类型的某些 Key 转为 可选的，其余的 Key 不变
 */
type PartialObjectPropByKeys<
  Obj extends Record<PropertyKey, any>,
  Keys extends keyof Obj
> = Partial<Pick<Obj, Keys>> & Omit<Obj, Keys>;
interface Dong {
  name: string;
  age: number;
  address: string;
}
type testPartialObjectPropByKeys = PartialObjectPropByKeys<
  Dong,
  "name" | "age"
>;
let a: testPartialObjectPropByKeys = { address: "1" };
