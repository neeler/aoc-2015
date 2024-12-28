import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle11 = new Puzzle({
    day: 11,
    parseInput: (fileData) => {
        return splitFilter(fileData)[0]!;
    },
    part1: (password) => {
        while (!isValidPassword(password)) {
            password = increment(password);
        }
        return password;
    },
    part2: (password) => {
        while (!isValidPassword(password)) {
            password = increment(password);
        }
        password = increment(password);
        while (!isValidPassword(password)) {
            password = increment(password);
        }
        return password;
    },
});

function isValidPassword(password: string) {
    const chars = password.split('');
    const charCodes: number[] = [];
    const charCodeDiffs: number[] = [];
    const forbiddenChars = ['i', 'o', 'l'];
    for (const char of chars) {
        if (forbiddenChars.includes(char)) {
            return false;
        }
        const charCode = char.charCodeAt(0);
        if (charCodes.length > 0) {
            charCodeDiffs.push(charCode - charCodes[charCodes.length - 1]!);
        }
        charCodes.push(charCode);
    }
    const diffString = charCodeDiffs.join(',');
    const nZeros = charCodeDiffs.filter((diff) => diff === 0).length;
    return (
        (diffString.startsWith('1,1') || diffString.includes(',1,1')) &&
        (nZeros > 2 || (nZeros === 2 && !diffString.includes('0,0')))
    );
}

function increment(s: string) {
    const chars = s.split('');

    for (let i = chars.length - 1; i >= 0; i--) {
        const { carry, char } = incrementChar(chars[i]!);
        chars[i] = char;

        if (!carry) {
            break;
        }
    }

    return chars.join('');
}

function incrementChar(c: string) {
    if (c.length !== 1) {
        throw new Error('Expected a single character.');
    }

    if (c === 'z') {
        return {
            carry: true,
            char: 'a',
        };
    }

    return {
        carry: false,
        char: String.fromCharCode(c.charCodeAt(0) + 1),
    };
}
