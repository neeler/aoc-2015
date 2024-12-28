import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { Graph, GraphNode } from '~/types/Graph';
import { Queue } from '~/types/Queue';

export const puzzle9 = new Puzzle({
    day: 9,
    parseInput: (fileData) => {
        const distances = splitFilter(fileData).map((line) => {
            const match = line.match(/(\w+) to (\w+) = (\d+)/);
            if (!match) {
                throw new Error(`Invalid input: ${line}`);
            }
            const [, loc1, loc2, distance] = match as [
                string,
                string,
                string,
                string,
            ];
            return { loc1, loc2, distance: +distance };
        });
        const graph = new Graph();
        distances.forEach(({ loc1, loc2, distance }) => {
            graph.linkNodesByName(loc1, loc2, distance);
        });
        return graph;
    },
    part1: (graph) => {
        const queue = new Queue<{
            nodesVisited: Set<GraphNode>;
            currentNode: GraphNode;
            distance: number;
        }>();
        graph.forEachNode((node) => {
            queue.add({
                nodesVisited: new Set([node]),
                currentNode: node,
                distance: 0,
            });
        });
        let shortestRoute = Infinity;
        queue.process(({ nodesVisited, currentNode, distance }) => {
            if (nodesVisited.size === graph.size) {
                shortestRoute = Math.min(distance, shortestRoute);
                return;
            }

            currentNode.forEachNeighbor((neighbor, distanceToNeighbor) => {
                if (nodesVisited.has(neighbor)) {
                    return;
                }
                queue.add({
                    nodesVisited: new Set([...nodesVisited, neighbor]),
                    currentNode: neighbor,
                    distance: distance + distanceToNeighbor,
                });
            });
        });
        return shortestRoute;
    },
    part2: (graph) => {
        const queue = new Queue<{
            nodesVisited: Set<GraphNode>;
            currentNode: GraphNode;
            distance: number;
        }>();
        graph.forEachNode((node) => {
            queue.add({
                nodesVisited: new Set([node]),
                currentNode: node,
                distance: 0,
            });
        });
        let longestRoute = 0;
        queue.process(({ nodesVisited, currentNode, distance }) => {
            if (nodesVisited.size === graph.size) {
                longestRoute = Math.max(distance, longestRoute);
                return;
            }

            currentNode.forEachNeighbor((neighbor, distanceToNeighbor) => {
                if (nodesVisited.has(neighbor)) {
                    return;
                }
                queue.add({
                    nodesVisited: new Set([...nodesVisited, neighbor]),
                    currentNode: neighbor,
                    distance: distance + distanceToNeighbor,
                });
            });
        });
        return longestRoute;
    },
});
