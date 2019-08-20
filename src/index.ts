import * as R from "ramda";
import Gameday from "./gameday";
import Match from "./match";

export const initGameday = (allTeams: T[]): Gameday => {
  const gameday = new Gameday();
  const bucketCount = allTeams.length / 2 - 1;
  const rightJokerMatch = new Match();
  rightJokerMatch.away = R.last(allTeams);
  gameday.rightJoker = rightJokerMatch;
  let teams = R.init(allTeams);
  for (let i = 0; i < bucketCount; i++) {
    const firstTeam = R.head(teams);
    const lastTeam = R.last(teams);
    const match = new Match();
    match.home = firstTeam;
    match.away = lastTeam;
    gameday.buckets.push(match);
    teams = R.init(R.tail(teams));
  }
  rightJokerMatch.home = teams[0]; // assign last remaining team
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

export const generateGamedays = (teams: t[]): Gameday[] => {
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

export const generateSchedule = (teams: T[], rematch = false): [Match[]] => {
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
