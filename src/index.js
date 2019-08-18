import * as R from "ramda";

const generateFixtures = teams => {
  const indexedTeams = R.zip(R.range(1, R.length(teams) + 1), teams);
  const regularIndexedTeams = R.dropLast(1, indexedTeams);
  const lastIndexedTeam = R.takeLast(1, indexedTeams);
  console.log(regularIndexedTeams);
  console.log(lastIndexedTeam);
};

export default generateFixtures;
