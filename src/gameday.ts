import Match from "./match";

export default class Gameday<T> {
  constructor(public leftJoker?: Match<T>, public rightJoker?: Match<T>, public buckets: Match<T>[] = []) {}
}
