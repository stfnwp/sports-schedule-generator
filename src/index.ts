import * as R from "ramda";
import Gameday from "./gameday";
import Match from "./match";

interface IndexedTeam {
  index: number;
  team: string;
}

const zipToIndexedTeam = (idx: number, name: string): IndexedTeam => ({ index: idx, team: name });

export const initGameday = (teams: string[]): Gameday => {
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

const shiftToLeft = (previousGameday: Gameday): Gameday => {
  const gameday = new Gameday();
  const leftJokerMatch = new Match();
  leftJokerMatch.home = previousGameday.rightJoker.away;
  leftJokerMatch.away = previousGameday.buckets[0].home;
  gameday.leftJoker = leftJokerMatch;
  for (let i = 0; i < previousGameday.buckets.length - 1; i++) {
    const match = new Match();
    match.home = previousGameday.buckets[i + 1].home;
    match.away = previousGameday.buckets[i].away;
    gameday.buckets.push(match);
  }
  const lastMatch = new Match();
  lastMatch.home = previousGameday.rightJoker.home;
  lastMatch.away = R.last(previousGameday.buckets).away;
  gameday.buckets.push(lastMatch);
  gameday.rightJoker = undefined;
  return gameday;
};

const shiftToRight = (previousGameday: Gameday): Gameday => {
  const gameday = new Gameday();
  const rightJokerMatch = new Match();
  rightJokerMatch.home = R.last(previousGameday.buckets).away;
  rightJokerMatch.away = previousGameday.leftJoker.home;
  gameday.rightJoker = rightJokerMatch;
  for (let i = 1; i < previousGameday.buckets.length; i++) {
    const match = new Match();
    match.away = previousGameday.buckets[i - 1].away;
    match.home = previousGameday.buckets[i].home;
    gameday.buckets.push(match);
  }
  const firstMatch = new Match();
  firstMatch.home = previousGameday.buckets[0].home;
  firstMatch.away = previousGameday.leftJoker.away;
  gameday.buckets = R.prepend(firstMatch, gameday.buckets);
  gameday.leftJoker = undefined;
  return gameday;
};

export const generateGameday = (previousGameday: Gameday): Gameday => {
  if (!previousGameday.leftJoker) {
    return shiftToLeft(previousGameday);
  }
  return shiftToRight(previousGameday);
};

export const generateGamedays = (teams: string[]): Gameday[] => {
  const schedule: Gameday[] = [];
  const firstGameday = initGameday(teams);
  schedule.push(firstGameday);
  let previousGameday = firstGameday;
  for (let i = 1; i < teams.length - 1; i++) {
    const gameday = generateGameday(previousGameday);
    schedule.push(gameday);
    previousGameday = gameday;
  }
  return schedule;
};

const createMatch = (match: Match, switchSides = true): Match => {
  if (!match) {
    return;
  }
  const createdMatch = R.clone(match);
  if (switchSides) {
    createdMatch.home = match.away;
    createdMatch.away = match.home;
  }
  return createdMatch;
};

const gamedayToMatchArray = (gameday: Gameday, switchSides: boolean): Match[] => {
  const matches: Match[] = [];
  if (gameday.leftJoker) {
    matches.push(createMatch(gameday.leftJoker, false)); // jokers already swept by algorithm
  }
  if (gameday.rightJoker) {
    matches.push(createMatch(gameday.rightJoker, false)); // jokers already swept by algorithm
  }
  for (const bucketMatch of gameday.buckets) {
    matches.push(createMatch(bucketMatch, switchSides));
  }
  return matches;
};

const createRematchSchedule = (schedule: [Match[]]): [Match[]] => {
  const rematchSchedule: [Match[]] = [];
  for (const matches of schedule) {
    const rematches: Match[] = R.map(createMatch, matches);
    rematchSchedule.push(rematches);
  }
  return rematchSchedule;
};

export const generateSchedule = (teams: string[], rematch = false): [Match[]] => {
  let schedule: [Match[]] = [];
  const gamedays = generateGamedays(teams);
  for (let i = 0; i < gamedays.length; i++) {
    const switchSides = i % 2 == 0;
    schedule.push(gamedayToMatchArray(gamedays[i], switchSides));
  }
  if (rematch) {
    schedule = R.concat(schedule, createRematchSchedule(schedule));
  }
  return schedule;
};
