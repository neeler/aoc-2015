import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle1 = new Puzzle({
    day: 1,
    parseInput: (fileData) => {
        return splitFilter(fileData, '');
    },
    part1: (chars) => {
        return chars.reduce((acc, curr) => {
            return acc + (curr === '(' ? 1 : -1);
        }, 0);
    },
    part2: (chars) => {
        let floor = 0;
        for (const [index, char] of chars.entries()) {
            if (char === '(') {
                floor++;
            } else {
                floor--;
            }
            if (floor < 0) {
                return index + 1;
            }
        }
    },
});
