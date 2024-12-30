import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { Graph } from '~/types/Graph';

export const puzzle13 = new Puzzle({
    day: 13,
    parseInput: (fileData) => {
        const rules = splitFilter(fileData).map((line) => {
            const match = line.match(
                /(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)./,
            );
            if (!match) {
                throw new Error(`Invalid input: ${line}`);
            }
            const [, person, action, amount, neighbor] = match;
            return {
                person: person!,
                diff: Number(amount!) * (action === 'gain' ? 1 : -1),
                neighbor: neighbor!,
            };
        });
        const people = new Set<string>();
        const rulesByPeople = new Map<string, Map<string, number>>();
        rules.forEach((rule) => {
            people.add(rule.person);
            people.add(rule.neighbor);
            if (!rulesByPeople.has(rule.person)) {
                rulesByPeople.set(rule.person, new Map<string, number>());
            }
            rulesByPeople.get(rule.person)!.set(rule.neighbor, rule.diff);
        });
        const graph = new Graph();
        for (const person of people) {
            graph.addNodeByName(person);
            for (const neighbor of people) {
                if (person === neighbor) {
                    continue;
                }
                const distance =
                    (rulesByPeople.get(person)?.get(neighbor) ?? 0) +
                    (rulesByPeople.get(neighbor)?.get(person) ?? 0);
                graph.linkNodesByName(person, neighbor, distance);
            }
        }
        return graph;
    },
    part1: (graph) => {
        return graph.getOptimalFullPath({
            priorityCompare: (a, b) => b - a,
            initialStat: -Infinity,
            statCompare: (a, b) => Math.max(a, b),
            returnToStart: true,
        });
    },
    part2: (graph) => {
        const me = graph.addNodeByName('Me');
        graph.forEachNode((node) => {
            if (node === me) return;
            graph.linkNodes(me, node, 0);
        });
        return graph.getOptimalFullPath({
            priorityCompare: (a, b) => b - a,
            initialStat: -Infinity,
            statCompare: (a, b) => Math.max(a, b),
            returnToStart: true,
        });
    },
});
