import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';

export const puzzle2 = new Puzzle({
    day: 2,
    parseInput: (fileData) => {
        return splitFilter(fileData).map(
            (line) => getNumbers(line) as [number, number, number],
        );
    },
    part1: (presents) => {
        return presents.reduce((sum, [l, w, h]) => {
            const sides = [l * w, w * h, h * l];
            const smallestSide = Math.min(...sides);
            return (
                2 * sides.reduce((area, side) => area + side, 0) +
                smallestSide +
                sum
            );
        }, 0);
    },
    part2: (presents) => {
        return presents.reduce((sum, [l, w, h]) => {
            return sum + l * w * h + 2 * Math.min(l + w, w + h, h + l);
        }, 0);
    },
});
