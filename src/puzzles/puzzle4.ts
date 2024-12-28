import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import crypto from 'crypto';

export const puzzle4 = new Puzzle({
    day: 4,
    parseInput: (fileData) => {
        return splitFilter(fileData)[0]!;
    },
    part1: (secretKey) => {
        let i = 0;
        let hash = '';

        while (true) {
            hash = crypto
                .createHash('md5')
                .update(`${secretKey}${i}`)
                .digest('hex');
            if (hash.startsWith('00000')) {
                break;
            }
            i++;
        }

        return i;
    },
    part2: (secretKey) => {
        let i = 0;
        let hash = '';

        while (true) {
            hash = crypto
                .createHash('md5')
                .update(`${secretKey}${i}`)
                .digest('hex');
            if (hash.startsWith('000000')) {
                break;
            }
            i++;
        }

        return i;
    },
});
