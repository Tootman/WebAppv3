import { djsModmyFunc, otherMod } from "./djs_module.js";
//import { User } from "./User.js";
//import { myOb } from "./app.js";

// const myNameSet = ['Jimmy', 'Scott', 'scott', 'Courtney','Steve']

describe("hello from djsmod", () => {
  it("should output hello", () => {
    expect(djsModmyFunc.hello()).toBe("hello");
  });
});

/*
describe("user functions", () => {
  it("should output hello", () => {
    expect(User.testFunc()).toBe("hello");
  });
});
*/

/*
describe("hello from App", () => {
  it("should output hello", () => {
    expect(myOb.hello()).toBe("hello");
  });
});
*/
