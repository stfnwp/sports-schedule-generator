import Match from "./match";

export default class Gameday<T> {
  leftJoker!: Match<T>;
  rightJoker!: Match<T>;
  buckets: Match<T>[];

  constructor() {
    this.buckets = [];
  }
}
