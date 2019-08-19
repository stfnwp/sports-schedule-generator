import { initGameday, generateGameday, generateGamedays, generateSchedule } from "./index";
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

describe("generateGameday", () => {
  it("generates second gameday with four teams", () => {
    const expectedGameday: Gameday = {
      leftJoker: { home: "d", away: "a" },
      buckets: [{ home: "b", away: "c" }],
      rightJoker: undefined
    };
    const firstGameday: Gameday = {
      leftJoker: undefined,
      buckets: [{ home: "a", away: "c" }],
      rightJoker: { home: "b", away: "d" }
    };
    expect(generateGameday(firstGameday)).toEqual(expectedGameday);
  });

  it("generates third gameday with four teams", () => {
    const expectedGameday: Gameday = {
      rightJoker: { home: "c", away: "d" },
      buckets: [{ home: "b", away: "a" }],
      leftJoker: undefined
    };
    const previousGameday: Gameday = {
      leftJoker: { home: "d", away: "a" },
      buckets: [{ home: "b", away: "c" }],
      rightJoker: undefined
    };
    expect(generateGameday(previousGameday)).toEqual(expectedGameday);
  });
});

describe("generateGamedays", () => {
  it("generates 3 gamedays for 4 teams", () => {
    const expectedGameday1: Gameday = {
      leftJoker: undefined,
      buckets: [{ home: "a", away: "c" }],
      rightJoker: { home: "b", away: "d" }
    };
    const expectedGameday2: Gameday = {
      leftJoker: { home: "d", away: "a" },
      buckets: [{ home: "b", away: "c" }],
      rightJoker: undefined
    };
    const expectedGameday3: Gameday = {
      rightJoker: { home: "c", away: "d" },
      buckets: [{ home: "b", away: "a" }],
      leftJoker: undefined
    };

    const gamedays = generateGamedays(["a", "b", "c", "d"]);
    expect(gamedays).toHaveLength(3);
    expect(gamedays[0]).toEqual(expectedGameday1);
    expect(gamedays[1]).toEqual(expectedGameday2);
    expect(gamedays[2]).toEqual(expectedGameday3);
  });
});

describe("generate schedule", () => {
  it("generates schedule with 3 gamedays for 4 teams", () => {
    const expectedGameday1 = [{ home: "b", away: "d" }, { home: "c", away: "a" }];
    const expectedGameday2 = [{ home: "d", away: "a" }, { home: "b", away: "c" }];
    const expectedGameday3 = [{ home: "c", away: "d" }, { home: "a", away: "b" }];

    const schedule = generateSchedule(["a", "b", "c", "d"]);
    expect(schedule).toHaveLength(3);
    expect(schedule[0]).toEqual(expectedGameday1);
    expect(schedule[1]).toEqual(expectedGameday2);
    expect(schedule[2]).toEqual(expectedGameday3);
  });

  it("generates schedule with 17 gamedays for 18 teams", () => {
    const schedule = generateSchedule([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r"
    ]);
    expect(schedule).toHaveLength(17);
    schedule.forEach(matches => expect(matches).toHaveLength(9));
  });
});

describe("generate schedule with rematch", () => {
  it("generates schedule with 6 gamedays for 4 teams", () => {
    const expectedGameday1 = [{ home: "b", away: "d" }, { home: "c", away: "a" }];
    const expectedGameday2 = [{ home: "d", away: "a" }, { home: "b", away: "c" }];
    const expectedGameday3 = [{ home: "c", away: "d" }, { home: "a", away: "b" }];
    const expectedGameday4 = [{ home: "d", away: "b" }, { home: "a", away: "c" }];
    const expectedGameday5 = [{ home: "a", away: "d" }, { home: "c", away: "b" }];
    const expectedGameday6 = [{ home: "d", away: "c" }, { home: "b", away: "a" }];

    const schedule = generateSchedule(["a", "b", "c", "d"], true);
    expect(schedule).toHaveLength(6);
    expect(schedule[0]).toEqual(expectedGameday1);
    expect(schedule[1]).toEqual(expectedGameday2);
    expect(schedule[2]).toEqual(expectedGameday3);
    expect(schedule[3]).toEqual(expectedGameday4);
    expect(schedule[4]).toEqual(expectedGameday5);
    expect(schedule[5]).toEqual(expectedGameday6);
  });
});
