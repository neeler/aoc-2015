import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle10 = new Puzzle({
    day: 10,
    parseInput: (fileData) => {
        return splitFilter(fileData)[0]!;
    },
    part1: (input) => {
        return lookAndSay(input, 40).length;
    },
    part2: (input) => {
        return lookAndSay(input, 50).length;
    },
});

function lookAndSay(input: string, iterations = 1): string {
    if (!input.length) {
        return '';
    }

    if (iterations === 0) {
        return input;
    }

    const numbers = input.split('').map(Number);

    let newString = '';
    let count = 1;
    let currentNumber = numbers[0]!;

    for (const n of numbers.slice(1)) {
        if (n === currentNumber) {
            count++;
        } else {
            newString += `${count}${currentNumber}`;
            count = 1;
            currentNumber = n;
        }
    }
    newString += `${count}${currentNumber}`;

    return lookAndSay(newString, iterations - 1);
}
