import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle10 = new Puzzle({
    day: 10,
    parseInput: (fileData) => {
        return splitFilter(fileData, '').map(Number);
    },
    part1: (input) => {
        return lookAndSay(input, 40).length;
    },
    part2: (input) => {
        return lookAndSay(input, 50).length;
    },
});

function lookAndSay(input: number[], iterations = 1): number[] {
    if (!input.length) {
        return [];
    }

    if (iterations === 0) {
        return input;
    }

    let nextNums: number[] = [];
    let count = 1;
    let currentNumber = input[0]!;

    for (let i = 1; i < input.length; i++) {
        const n = input[i]!;
        if (n === currentNumber) {
            count++;
        } else {
            nextNums.push(count, currentNumber);
            count = 1;
            currentNumber = n;
        }
    }

    nextNums.push(count, currentNumber);

    return lookAndSay(nextNums, iterations - 1);
}
