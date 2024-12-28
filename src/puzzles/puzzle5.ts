import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

export const puzzle5 = new Puzzle({
    day: 5,
    parseInput: (fileData) => {
        return splitFilter(fileData);
    },
    part1: (strings) => {
        const isNice = (s: string): boolean => {
            const charCounts = new Map<string, number>();

            const prohibited = ['ab', 'cd', 'pq', 'xy'];
            let hasSeenDupe = false;
            let lastChar = '';
            for (const char of s.split('')) {
                charCounts.set(char, (charCounts.get(char) ?? 0) + 1);

                if (char === lastChar) {
                    hasSeenDupe = true;
                }

                const pair = lastChar + char;
                if (prohibited.includes(pair)) {
                    return false;
                }

                lastChar = char;
            }
            if (!hasSeenDupe) {
                return false;
            }

            const vowelCount = ['a', 'e', 'i', 'o', 'u'].reduce(
                (sum, vowel) => {
                    return sum + (charCounts.get(vowel) ?? 0);
                },
                0,
            );
            return vowelCount >= 3;
        };
        return strings.filter((s) => isNice(s)).length;
    },
    part2: (strings) => {
        const isNice = (s: string): boolean => {
            const charIndexes = new Map<string, number[]>();
            const pairIndexes = new Map<string, number[]>();

            let lastChar = '';
            for (const [index, char] of s.split('').entries()) {
                const indexes = charIndexes.get(char) ?? [];
                indexes.push(index);
                charIndexes.set(char, indexes);

                if (lastChar) {
                    const pair = lastChar + char;
                    const indexes = pairIndexes.get(pair) ?? [];
                    indexes.push(index - 1);
                    pairIndexes.set(pair, indexes);
                }

                lastChar = char;
            }

            const meetsPairRequirement = [...pairIndexes.values()].some(
                (indexes) => {
                    return (
                        indexes.length > 1 &&
                        indexes.some(
                            (i) =>
                                Math.max(
                                    ...indexes.map((j) => Math.abs(j - i)),
                                ) > 1,
                        )
                    );
                },
            );
            if (!meetsPairRequirement) {
                return false;
            }

            return [...charIndexes.values()].some((indexes) => {
                return (
                    indexes.length > 1 &&
                    indexes.some((i) =>
                        indexes
                            .map((j) => Math.abs(j - i))
                            .some((diff) => diff === 2),
                    )
                );
            });
        };
        return strings.filter((s) => isNice(s)).length;
    },
});
