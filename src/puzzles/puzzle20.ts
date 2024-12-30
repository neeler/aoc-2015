import { Puzzle } from './Puzzle';
import { getNumbers } from '~/util/parsing';
import { findFactors } from '~/util/arithmetic';

export const puzzle20 = new Puzzle({
    day: 20,
    parseInput: (fileData) => {
        return getNumbers(fileData)[0]!;
    },
    part1: (target) => {
        const presentsPerElf = 10;

        let iHouse = 1;
        while (
            countPresents({
                iHouse,
                presentsPerElf,
            }) < target
        ) {
            iHouse++;
        }

        return iHouse;
    },
    part2: (target) => {
        const presentsPerElf = 11;
        const maxDeliveriesPerElf = 50;

        let iHouse = 1;
        while (
            countPresents({
                iHouse,
                presentsPerElf,
                maxDeliveriesPerElf,
            }) < target
        ) {
            iHouse++;
        }

        return iHouse;
    },
});

function countPresents({
    iHouse,
    presentsPerElf,
    maxDeliveriesPerElf = Infinity,
}: {
    iHouse: number;
    presentsPerElf: number;
    maxDeliveriesPerElf?: number;
}): number {
    const relevantElves = findFactors(iHouse);

    let nPresents = 0;
    for (const iElf of relevantElves) {
        if (iHouse < maxDeliveriesPerElf * iElf) {
            nPresents += iElf * presentsPerElf;
        }
    }

    return nPresents;
}
