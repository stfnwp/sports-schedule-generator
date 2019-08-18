import generateFixtures from "./index";

describe("basic", () => {
  it("works", () => {
    const expected = [
      { matchday: 1, matches: [{ homeTeam: "a", awayTeam: "b" }, { homeTeam: "c", awayTeam: "d" }] },
      { matchday: 2, matches: [{ homeTeam: "a", awayTeam: "d" }, { homeTeam: "c", awayTeam: "b" }] },
      { matchday: 3, matches: [{ homeTeam: "a", awayTeam: "c" }, { homeTeam: "b", awayTeam: "d" }] }
    ];
    expect(generateFixtures(["a", "b", "c", "d"])).toStrictEqual(expected);
  });
});
