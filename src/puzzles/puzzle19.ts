import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { PriorityQueue } from '~/types/PriorityQueue';

interface Replacement {
    from: string;
    to: string;
}

export const puzzle19 = new Puzzle({
    day: 19,
    parseInput: (fileData) => {
        const [replacements, molecule] = splitFilter(fileData, '\n\n') as [
            string,
            string,
        ];
        return {
            replacements: splitFilter(replacements).map((line): Replacement => {
                const [from, to] = line.split(' => ') as [string, string];
                return {
                    from,
                    to,
                };
            }),
            molecule,
        };
    },
    part1: ({ replacements, molecule }) => {
        return getNextOptions({ molecule, replacements }).size;
    },
    part2: ({ replacements, molecule }) => {
        const starterMolecule = 'e';
        const reversedReplacements = replacements.map(({ from, to }) => ({
            from: to,
            to: from,
        }));
        const queue = new PriorityQueue<{
            molecule: string;
            steps: number;
        }>({
            compare: (a, b) => a.molecule.length - b.molecule.length,
        });
        queue.add({ molecule, steps: 0 });
        let bestSteps = Infinity;
        const bestSeen = new Map<string, number>();
        queue.process(({ molecule, steps }) => {
            if (molecule === starterMolecule) {
                queue.reset();
                return;
            }
            if (steps >= bestSteps) {
                return;
            }
            const nextOptions = getNextOptions({
                molecule,
                replacements: reversedReplacements,
            });
            nextOptions.forEach((nextMolecule) => {
                const nextSteps = steps + 1;
                if (nextSteps < (bestSeen.get(nextMolecule) ?? Infinity)) {
                    bestSeen.set(nextMolecule, nextSteps);
                    queue.add({ molecule: nextMolecule, steps: nextSteps });
                }
            });
        });
        return bestSeen.get(starterMolecule) ?? Infinity;
    },
});

function getNextOptions({
    molecule,
    replacements,
}: {
    molecule: string;
    replacements: Replacement[];
}) {
    const molecules = new Set<string>();
    replacements.forEach(({ from, to }) => {
        const maxIndex = molecule.length - from.length;
        for (let i = 0; i <= maxIndex; i++) {
            i = molecule.indexOf(from, i);
            if (i === -1) {
                break;
            }
            molecules.add(
                molecule.slice(0, i) + to + molecule.slice(i + from.length),
            );
        }
    });
    return molecules;
}
