import { Queue } from '~/types/Queue';

export class Graph {
    nodes = new Set<GraphNode>();
    nodesByName = new Map<string, GraphNode>();
    distances = new Map<string, Map<string, number>>();

    addNode(node: GraphNode) {
        this.nodes.add(node);
        this.nodesByName.set(node.name, node);
    }

    addNodeByName(name: string) {
        const node = this.getNodeByName(name) ?? new GraphNode(name);
        this.addNode(node);
        return node;
    }

    getNodeByName(name: string) {
        return this.nodesByName.get(name);
    }

    getDistance(node1: GraphNode, node2: GraphNode) {
        return this.distances.get(node1.name)?.get(node2.name) ?? Infinity;
    }

    linkNodes(node1: GraphNode, node2: GraphNode, distance: number) {
        if (!this.distances.has(node1.name)) {
            this.distances.set(node1.name, new Map());
        }
        this.distances.get(node1.name)!.set(node2.name, distance);

        if (!this.distances.has(node2.name)) {
            this.distances.set(node2.name, new Map());
        }
        this.distances.get(node2.name)!.set(node1.name, distance);

        node1.linkTo(node2, distance);
        node2.linkTo(node1, distance);
    }

    linkNodesByName(n1: string, n2: string, distance: number) {
        const node1 = this.addNodeByName(n1);
        const node2 = this.addNodeByName(n2);
        this.linkNodes(node1, node2, distance);
        node1.linkTo(node2, distance);
        node2.linkTo(node1, distance);
    }

    forEachNode(callback: (node: GraphNode) => void) {
        this.nodes.forEach(callback);
    }

    get size() {
        return this.nodes.size;
    }
}

export class GraphNode {
    distancesTo = new Map<GraphNode, number>();

    constructor(public name: string) {}

    linkTo(node: GraphNode, distance: number) {
        this.distancesTo.set(node, distance);
    }

    neighbors() {
        return Array.from(this.distancesTo.keys());
    }

    forEachNeighbor(callback: (node: GraphNode, distance: number) => void) {
        this.distancesTo.forEach((distance, node) => {
            callback(node, distance);
        });
    }
}
