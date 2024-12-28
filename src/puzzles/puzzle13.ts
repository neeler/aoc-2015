import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { Queue } from '~/types/Queue';
import { Graph, GraphNode } from '~/types/Graph';

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
        return {
            rulesByPeople,
            people,
            graph,
        };
    },
    part1: ({ graph }) => {
        return walkGraphForMaxHappiness(graph);
    },
    part2: ({ graph }) => {
        const me = graph.addNodeByName('Me');
        graph.forEachNode((node) => {
            if (node === me) return;
            graph.linkNodes(me, node, 0);
        });
        return walkGraphForMaxHappiness(graph);
    },
});

function walkGraphForMaxHappiness(graph: Graph) {
    const queue = new Queue<{
        nodesVisited: Set<GraphNode>;
        currentNode: GraphNode;
        distance: number;
    }>();
    const startNode = graph.nodes.values().next().value!;
    queue.add({
        nodesVisited: new Set([startNode]),
        currentNode: startNode,
        distance: 0,
    });
    let maxHappiness = -Infinity;
    queue.process(({ nodesVisited, currentNode, distance }) => {
        if (currentNode === startNode && nodesVisited.size === graph.size) {
            maxHappiness = Math.max(distance, maxHappiness);
            return;
        }

        currentNode.forEachNeighbor((neighbor, distanceToNeighbor) => {
            if (
                nodesVisited.has(neighbor) &&
                (neighbor !== startNode || nodesVisited.size !== graph.size)
            ) {
                return;
            }
            queue.add({
                nodesVisited: new Set([...nodesVisited, neighbor]),
                currentNode: neighbor,
                distance: distance + distanceToNeighbor,
            });
        });
    });
    return maxHappiness;
}
