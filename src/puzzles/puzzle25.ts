import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';
import { mod } from '~/util/arithmetic';

export const puzzle25 = new Puzzle({
    day: 25,
    parseInput: (fileData) => {
        return getNumbers(fileData) as [number, number];
    },
    part1: ([targetRow, targetCol]) => {
        let targetIteration = 1;
        for (let row = 1; row <= targetRow; row++) {
            targetIteration += row - 1;
        }
        for (let col = 2; col <= targetCol; col++) {
            targetIteration += targetRow + col - 1;
        }
        let value = 20151125;
        for (let i = 1; i < targetIteration; i++) {
            value = mod(value * 252533, 33554393);
        }
        return value;
    },
    part2: () => {
        return true;
    },
});
