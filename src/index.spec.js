import foo from "./index";

describe("basic", () => {
  it("works", () => {
    expect(foo.teams()).toHaveLength(2);
  });
});
