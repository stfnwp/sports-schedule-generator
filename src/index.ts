import * as R from "ramda";
import Gameday from "./gameday";
import Match from "./match";

interface IndexedTeam {
  index: number;
  team: string;
}

const zipToIndexedTeam = (idx: number, name: string): IndexedTeam => ({ index: idx, team: name });

const initGameday = (teams: string[]): Gameday => {
  const gameday = new Gameday();
  const bucketCount = teams.length / 2 - 1;
  const rightJokerMatch = new Match();
  rightJokerMatch.away = R.last(teams);
  gameday.rightJoker = rightJokerMatch;
  const indexedTeams = R.zipWith(zipToIndexedTeam, R.range(1, R.length(teams) + 1), teams);
  let regularIndexedTeams = R.init(indexedTeams);
  for (let i = 0; i < bucketCount; i++) {
    const firstTeam = R.head(regularIndexedTeams);
    const lastTeam = R.last(regularIndexedTeams);
    const match = new Match();
    match.home = firstTeam.team;
    match.away = lastTeam.team;
    gameday.buckets.push(match);
    regularIndexedTeams = R.init(R.tail(regularIndexedTeams));
  }
  rightJokerMatch.home = regularIndexedTeams[0].team; // assign last remaining team
  return gameday;
};

export default initGameday;
