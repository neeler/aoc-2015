import { Puzzle } from './Puzzle';
import { getMultilineNumbers } from '~/util/parsing';
import { product, sum } from '~/util/arithmetic';

export const puzzle24 = new Puzzle({
    day: 24,
    parseInput: (fileData) => {
        return getMultilineNumbers(fileData).sort((a, b) => b - a);
    },
    part1: (packages) => {
        const totalWeight = sum(packages);
        const weightPerGroup = totalWeight / 3;
        const optimalFirstGrouping = getOptimalFirstGrouping(
            packages,
            weightPerGroup,
        )[0]!;
        return product(Array.from(optimalFirstGrouping));
    },
    part2: (packages) => {
        const totalWeight = sum(packages);
        const weightPerGroup = totalWeight / 4;
        const optimalFirstGrouping = getOptimalFirstGrouping(
            packages,
            weightPerGroup,
        )[0]!;
        return product(Array.from(optimalFirstGrouping));
    },
});

function getOptimalFirstGrouping(packages: number[], targetWeight: number) {
    let groupings: {
        grouping: Set<number>;
        weight: number;
    }[] = [
        {
            grouping: new Set(),
            weight: 0,
        },
    ];
    let lowestGroupCount = Infinity;
    let lowestQE = Infinity;

    for (const p of packages) {
        let nextGroupings: {
            grouping: Set<number>;
            weight: number;
        }[] = [];
        for (const { grouping, weight } of groupings) {
            if (weight === targetWeight) {
                nextGroupings.push({ grouping, weight });
                continue;
            }

            nextGroupings.push({ grouping, weight });

            if (grouping.size >= lowestGroupCount) {
                continue;
            }

            const nextWeight = weight + p;
            if (nextWeight > targetWeight) {
                continue;
            }

            const nextGrouping = new Set(grouping);
            nextGrouping.add(p);
            nextGroupings.push({
                grouping: nextGrouping,
                weight: nextWeight,
            });
            if (nextWeight === targetWeight) {
                const qe = product(Array.from(nextGrouping));
                if (nextGrouping.size < lowestGroupCount) {
                    lowestGroupCount = nextGrouping.size;
                    lowestQE = qe;
                } else if (nextGrouping.size === lowestGroupCount) {
                    if (qe < lowestQE) {
                        lowestQE = qe;
                    }
                }
            }
        }
        groupings = nextGroupings.filter(({ grouping, weight }) => {
            if (weight === targetWeight) {
                return (
                    grouping.size === lowestGroupCount &&
                    product(Array.from(grouping)) === lowestQE
                );
            }
            return grouping.size < lowestGroupCount;
        });
    }

    return groupings
        .filter(
            ({ grouping, weight }) =>
                weight === targetWeight &&
                grouping.size === lowestGroupCount &&
                product(Array.from(grouping)) === lowestQE,
        )
        .map(({ grouping }) => grouping);
}
