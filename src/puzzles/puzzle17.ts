import { Puzzle } from './Puzzle';
import { getMultilineNumbers } from '~/util/parsing';

class Container {
    constructor(
        public id: number,
        public size: number,
    ) {}
}

export const puzzle17 = new Puzzle({
    day: 17,
    parseInput: (fileData, { example }) => {
        const containers = getMultilineNumbers(fileData);
        return {
            containers: containers
                .map((size, i) => new Container(i, size))
                .sort((a, b) => b.size - a.size),
            isExample: example,
        };
    },
    part1: ({ containers, isExample }) => {
        return getCombos(containers, isExample ? 25 : 150).length;
    },
    part2: ({ containers, isExample }) => {
        const combos = getCombos(containers, isExample ? 25 : 150);
        const minContainers = Math.min(...combos.map((c) => c.size));
        return combos.filter((c) => c.size === minContainers).length;
    },
});

function getCombos(containers: Container[], targetCapacity: number) {
    let combos: Set<Container>[] = [new Set()];
    for (const container of containers) {
        const nextCombos: Set<Container>[] = [];
        for (const combo of combos) {
            nextCombos.push(combo);
            const capacity = getCapacity(combo);
            const nextCapacity = capacity + container.size;
            if (nextCapacity <= targetCapacity) {
                const nextCombo = new Set(combo);
                nextCombo.add(container);
                nextCombos.push(nextCombo);
            }
        }
        combos = nextCombos;
    }

    return combos.filter((combo) => getCapacity(combo) === targetCapacity);
}

function getCapacity(combo: Set<Container>) {
    let capacity = 0;
    for (const container of combo) {
        capacity += container.size;
    }
    return capacity;
}
