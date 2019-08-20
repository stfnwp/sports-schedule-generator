# sports-schedule-generator
Generates schedules primarily used in team sports

# Usage
```
import { generateSchedule } from "sports-schedule-generator";

const schedule = generateSchedule(["a", "b", "c", "d"]);
```
The function `generateSchedule` creates an array of match-arrays:

```
// schedule[0]: [{ home: "b", away: "d" }, { home: "c", away: "a" }];
// schedule[1]: [{ home: "d", away: "a" }, { home: "b", away: "c" }];
// schedule[2]: [{ home: "c", away: "d" }, { home: "a", away: "b" }];
```

Passing the optional `rematch` argument will result in the following matches:
```
const schedule = generateSchedule(["team-a", "team-b", "team-c", "team-d"], true);
```

```
// schedule[0]: [{ home: "b", away: "d" }, { home: "c", away: "a" }];
// schedule[1]: [{ home: "d", away: "a" }, { home: "b", away: "c" }];
// schedule[2]: [{ home: "c", away: "d" }, { home: "a", away: "b" }];
// schedule[3]: [{ home: "d", away: "b" }, { home: "a", away: "c" }];
// schedule[4]: [{ home: "a", away: "d" }, { home: "c", away: "b" }];
// schedule[5]: [{ home: "d", away: "c" }, { home: "b", away: "a" }];
```

The following algorithm is implemented to create the matchups:
https://de.wikipedia.org/wiki/Spielplan_(Sport)#/media/Datei:Spielplan.png