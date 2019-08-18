import initGameday from "./index";
import Gameday from "./gameday";

describe("initGameday", () => {
  it("initializes first gameday with four teams", () => {
    const expectedGameday: Gameday = {
      leftJoker: undefined,
      buckets: [{ home: "a", away: "c" }],
      rightJoker: { home: "b", away: "d" }
    };
    expect(initGameday(["a", "b", "c", "d"])).toEqual(expectedGameday);
  });

  it("initializes first gameday with six teams", () => {
    const expectedGameday: Gameday = {
      leftJoker: undefined,
      buckets: [{ home: "a", away: "e" }, { home: "b", away: "d" }],
      rightJoker: { home: "c", away: "f" }
    };
    expect(initGameday(["a", "b", "c", "d", "e", "f"])).toEqual(expectedGameday);
  });
});
