import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

class Sue {
    id: number;
    items: Map<string, number>;

    constructor({ id, items }: { id: number; items: Map<string, number> }) {
        this.id = id;
        this.items = items;
    }
}

export const puzzle16 = new Puzzle({
    day: 16,
    parseInput: (fileData) => {
        const sues = splitFilter(fileData).map((line) => {
            const match = line.match(
                /Sue (\d+): (\w+): (\d+), (\w+): (\d+), (\w+): (\d+)/,
            );
            if (!match) {
                throw new Error(`Invalid input: ${line}`);
            }
            const [, id, item1, count1, item2, count2, item3, count3] = match;
            const items = new Map<string, number>();
            items.set(item1!, Number(count1));
            items.set(item2!, Number(count2));
            items.set(item3!, Number(count3));
            return new Sue({
                id: Number(id),
                items,
            });
        });
        return {
            sues,
            readings: splitFilter(`
children: 3
cats: 7
samoyeds: 2
pomeranians: 3
akitas: 0
vizslas: 0
goldfish: 5
trees: 3
cars: 2
perfumes: 1`).reduce<Record<string, number>>((acc, line) => {
                const [key, value] = line.split(': ') as [string, string];
                acc[key] = Number(value);
                return acc;
            }, {}),
        };
    },
    part1: ({ sues, readings }) => {
        const possibleSues = sues.filter((sue) => {
            for (const [key, value] of sue.items.entries()) {
                if (value !== readings[key]) {
                    return false;
                }
            }
            return true;
        });
        if (possibleSues.length !== 1) {
            throw new Error('Expected exactly one possible Sue.');
        }
        return possibleSues[0]!.id;
    },
    part2: ({ sues, readings }) => {
        const possibleSues = sues.filter((sue) => {
            for (const [key, value] of sue.items.entries()) {
                if (['cats', 'trees'].includes(key)) {
                    if (value <= readings[key]!) {
                        return false;
                    }
                } else if (['pomeranians', 'goldfish'].includes(key)) {
                    if (value >= readings[key]!) {
                        return false;
                    }
                } else if (value !== readings[key]) {
                    return false;
                }
            }
            return true;
        });
        if (possibleSues.length !== 1) {
            throw new Error('Expected exactly one possible Sue.');
        }
        return possibleSues[0]!.id;
    },
});
