import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle14 = new Puzzle({
    day: 14,
    parseInput: (fileData, { example }) => {
        const reindeer = splitFilter(fileData).map((line) => {
            const match = line.match(/(\w+)\D+(\d+)\D+(\d+)\D+(\d+)/);
            if (!match) {
                throw new Error(`Invalid line: ${line}`);
            }
            const [, name, speed, time, rest] = match;
            return {
                name: name!,
                speed: Number(speed),
                flyTime: Number(time),
                restTime: Number(rest),
            };
        });
        return {
            reindeer,
            isExample: example,
        };
    },
    part1: ({ reindeer, isExample }) => {
        const maxTime = isExample ? 1000 : 2503;
        return Math.max(
            ...reindeer.map(({ speed, flyTime, restTime }) => {
                let timeSoFar = 0;
                let distance = 0;
                while (timeSoFar < maxTime) {
                    distance += Math.min(maxTime - timeSoFar, flyTime) * speed;
                    timeSoFar += flyTime + restTime;
                }
                return distance;
            }),
        );
    },
    part2: ({ reindeer: reindeerStats, isExample }) => {
        const maxTime = isExample ? 1000 : 2503;
        const reindeer = reindeerStats.map((stats) => ({
            ...stats,
            distance: 0,
            points: 0,
            isResting: false,
            timestamp: 0,
        }));
        for (let timeSoFar = 1; timeSoFar <= maxTime; timeSoFar++) {
            let maxDistance = 0;
            reindeer.forEach((r) => {
                if (r.isResting) {
                    if (timeSoFar - r.timestamp === r.restTime) {
                        r.isResting = false;
                        r.timestamp = timeSoFar;
                    }
                } else {
                    r.distance += r.speed;
                    if (timeSoFar - r.timestamp === r.flyTime) {
                        r.isResting = true;
                        r.timestamp = timeSoFar;
                    }
                }
                maxDistance = Math.max(maxDistance, r.distance);
            });
            reindeer.forEach((r) => {
                if (r.distance === maxDistance) {
                    r.points++;
                }
            });
        }
        return Math.max(...reindeer.map(({ points }) => points));
    },
});
