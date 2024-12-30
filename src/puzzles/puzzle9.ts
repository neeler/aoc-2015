import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { Graph } from '~/types/Graph';

export const puzzle9 = new Puzzle({
    day: 9,
    parseInput: (fileData) => {
        const distances = splitFilter(fileData).map((line) => {
            const match = line.match(/(\w+) to (\w+) = (\d+)/);
            if (!match) {
                throw new Error(`Invalid input: ${line}`);
            }
            const [, loc1, loc2, distance] = match as [
                string,
                string,
                string,
                string,
            ];
            return { loc1, loc2, distance: +distance };
        });
        const graph = new Graph();
        distances.forEach(({ loc1, loc2, distance }) => {
            graph.linkNodesByName(loc1, loc2, distance);
        });
        return graph;
    },
    part1: (graph) => {
        return graph.getOptimalFullPath({
            priorityCompare: (a, b) => a - b,
            initialStat: Infinity,
            statCompare: (a, b) => Math.min(a, b),
        });
    },
    part2: (graph) => {
        return graph.getOptimalFullPath({
            priorityCompare: (a, b) => b - a,
            initialStat: 0,
            statCompare: (a, b) => Math.max(a, b),
        });
    },
});
