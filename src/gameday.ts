import Match from "./match";

export default class Gameday {
  leftJoker: Match | undefined;
  rightJoker: Match | undefined;
  buckets: Match[];

  constructor() {
    this.buckets = [];
  }
}
