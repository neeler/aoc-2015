import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';
import { sum } from '~/util/arithmetic';

export const puzzle12 = new Puzzle({
    day: 12,
    parseInput: (fileData) => {
        return splitFilter(fileData)[0]!;
    },
    part1: (string) => {
        const numbers = getNumbers(string);
        return sum(numbers);
    },
    part2: (string) => {
        const data = JSON.parse(string);

        const getSum = (obj: any): number => {
            if (typeof obj === 'number') {
                return obj;
            }
            if (typeof obj === 'string') {
                return 0;
            }
            if (Array.isArray(obj)) {
                return obj.reduce((acc, val) => acc + getSum(val), 0);
            }
            if (typeof obj === 'object') {
                if (Object.values(obj).includes('red')) {
                    return 0;
                }
                return Object.values(obj).reduce<number>(
                    (acc, val) => acc + getSum(val),
                    0,
                );
            }
            return 0;
        };

        return getSum(data);
    },
});
