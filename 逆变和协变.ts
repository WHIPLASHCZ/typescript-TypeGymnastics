class Animal {
  name!: string;
  animalType!: string;
}

class Dog extends Animal {
  breed!: string;
}

class AnimalLike {
  name!: string;
  animalType!: string;
  sth!: string;
}

/** 复习extends： */
// 只要值的类型A可以满足被赋值变量的类型B所需要的东西，就可以赋值，A extends B的结果就为true；
type DogExtendsAnimal = Dog extends Animal ? true : false; //true
type AnimalExtendsDog = Animal extends Dog ? true : false; //false

let animal: Animal = new Dog();
// let dog: Dog = new Animal(); 报错：类型 "Animal" 中缺少属性 "breed"，但类型 "Dog" 中需要该属性。ts(2741)
let animal2: Animal = new AnimalLike();

/** 逆变和协变： */
let animalFunc: () => Animal;
let dogFunc: () => Dog = () => new Dog();

// 协变，子类型可以赋值给父类型
animalFunc = dogFunc;

let animalHandler: (a: Animal) => void = d => {};
let dogHandler: (d: Dog) => void;

// 逆变，父类型可以赋值给子类型
dogHandler = animalHandler;
type ContravariantUtil<T> = (T extends T ? (a: T) => void : never) extends (
  x: infer R
) => void
  ? R
  : never;
type ContravariantUtilTest = ContravariantUtil<Dog | AnimalLike>;
type ContravariantUtil2<T> = T extends T
  ? ((a: T) => void) extends (x: infer R) => void
    ? R
    : never
  : never;
type ContravariantUtil2Test = ContravariantUtil2<Dog | AnimalLike | Animal>; //

// 协变（covariant）
interface Person {
  name: string;
  age: number;
}
interface Guang {
  name: string;
  age: number;
  hobbies: string[];
}

// 这里 Guang 是 Person 的子类型，更具体，那么 Guang 类型的变量就可以赋值给 Person 类型：
let person: Person = {
  name: "",
  age: 20,
};

let guang: Guang = {
  name: "guang",
  age: 20,
  hobbies: ["play game", "writing"],
};

// 这并不会报错，虽然这俩类型不一样，但是依然是类型安全的。
// 这种子类型可以赋值给父类型的情况就叫做协变。
person = guang;

// 逆变（contravariant）
let printGuang: (guang: Guang) => void;
printGuang = guang => console.log(guang.hobbies);

let printPerson: (person: Person) => void;
printPerson = person => console.log(person.name);

printGuang = printPerson;
/* 报错：不能将类型“(guang: Guang) => void”分配给类型“(person: Person) => void”。
   参数“guang”和“person” 的类型不兼容。
   类型 "Person" 中缺少属性 "hobbies"，但类型 "Guang" 中需要该属性。ts(2322)*/
// printPerson = printGuang;

printPerson(person);
printPerson(guang);

// printGuang(person); 报错：类型“Person”的参数不能赋给类型“Guang”的参数。类型 "Person" 中缺少属性 "hobbies"，但类型 "Guang" 中需要该属性。ts(2345)
printGuang(guang);

// 逆变在纯类型代码中的体现
// 注意：若A extends B为true，则A类型的值可以赋值给B类型的变量；若为false则不行。
type FatherParamaters = (T: Person) => void;
type SonParamaters = (T: Guang) => void;
type Contravariant = SonParamaters extends FatherParamaters ? true : false; // false
type Contravariant2 = FatherParamaters extends SonParamaters ? true : false; // true

// 下面的例子说明了如何通过共变位置上同一类型变量的多个候选项推断出联合类型：
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;
type T10 = Foo<{ a: string; b: string }>; // string
type T11 = Foo<{ a: string; b: number }>; // string | number

// 同样地，在逆变位置上同一类型变量的多个候选变量会导致推断出交叉类型：
type hasName = { name: string };
type hasAge = { age: number };

type Contravariant3<T> = T extends {
  a: (x: infer U) => void;
  b: (x: infer U) => void;
}
  ? U
  : never;
type T20 = Contravariant3<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Contravariant3<{ a: (x: hasName) => void; b: (x: hasAge) => void }>; // hasName & hasAge

type Mixed<T> = T extends (a: infer U) => infer U ? U : never;
type T22 = Mixed<(a: hasName) => hasAge>; //never
type T3 = Mixed<(x: string) => string>; // string
type T4 = Mixed<((x: hasName) => hasName) | ((x: hasAge) => hasAge)>; //  hasName | hasAge

type Contravariant4<T> = T extends (a: infer U) => any ? U : never;
type Contravariant4Test = Contravariant4<
  ((a: hasName) => void) | ((a: hasAge) => void)
>; // hasName | hasAge

/**
 * 逆变与分布式条件类型探究
 */
type ToFun<U> = U extends U ? (x: U) => any : never;
//  左侧直接是联合类型，不触发分布式条件类型，直接用整个联合类型判断
type UnionToIntersection<U> = ToFun<U> extends (x: infer R) => any ? R : never;

// 左侧是泛型并传入了联合类型，会触发分布式条件类型
type UnionFunToIntersection<U extends (x: any) => any> = U extends (
  x: infer R
) => any
  ? R
  : never;

let test: UnionToIntersection<hasName | hasAge>; //hasName & hasAge
let test2: UnionFunToIntersection<
  ((a: hasName) => void) | ((a: hasAge) => void)
>; //hasName | hasAge

/**
 *  在ts源码中，高级类型会根据 extends 左侧是否是类型参数 来决定是否启用"分布式条件类型"这个特性；
 */
// 左侧若直接是联合类型，不触发分布式条件类型，直接用整个联合类型判断
type straightUnionTest = number | boolean extends boolean ? "Y" : "N"; // N

// 左侧若是泛型并传入了联合类型，则会触发分布式条件类型，将联合类型中的每个类型都单独进行计算，最后将结果进行联合。
type genericUnionTest<T> = T extends boolean ? "Y" : "N";
type genericUnionTestRes = genericUnionTest<number | boolean>; //"N" | "Y"

export {};
