import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle8 = new Puzzle({
    day: 8,
    parseInput: (fileData) => {
        return splitFilter(fileData);
    },
    part1: (strings) => {
        return strings.reduce((sum, string) => {
            let nChars = 0;
            let escaped = false;
            let isHex = false;
            let hexCount = 0;
            for (const char of string.slice(1, string.length - 1).split('')) {
                if (escaped) {
                    if (char === 'x') {
                        isHex = true;
                    } else if (isHex) {
                        if (hexCount < 1) {
                            hexCount++;
                        } else {
                            isHex = false;
                            hexCount = 0;
                            escaped = false;
                            nChars++;
                        }
                    } else {
                        isHex = false;
                        escaped = false;
                        nChars++;
                    }
                } else if (char === '\\') {
                    escaped = true;
                } else {
                    nChars++;
                }
            }
            return sum + string.length - nChars;
        }, 0);
    },
    part2: (strings) => {
        return strings.reduce((sum, string) => {
            return sum + JSON.stringify(string).length - string.length;
        }, 0);
    },
});
