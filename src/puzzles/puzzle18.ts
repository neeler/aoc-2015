import { Puzzle } from './Puzzle';
import { Grid, GridCoordinate, GridNode } from '~/types/Grid';

class Node extends GridNode {
    isOn: boolean;

    constructor({
        input,
        row,
        col,
    }: GridCoordinate & {
        input: string;
    }) {
        super({ row, col });
        this.isOn = input === '#';
    }

    toString(): string {
        return this.isOn ? '#' : '.';
    }
}

export const puzzle18 = new Puzzle({
    day: 18,
    parseInput: (fileData, { example }) => {
        const grid = Grid.stringToNodeGrid(fileData, (data) => new Node(data));
        return {
            grid,
            isExample: example,
        };
    },
    part1: ({ grid, isExample }) => {
        const nSteps = isExample ? 4 : 100;
        for (let i = 0; i < nSteps; i++) {
            step(grid);
        }
        return grid.filter((node) => node.isOn).length;
    },
    part2: ({ grid, isExample }) => {
        const nSteps = isExample ? 5 : 100;
        const stuckOn = [
            {
                row: 0,
                col: 0,
            },
            {
                row: 0,
                col: grid.width - 1,
            },
            {
                row: grid.height - 1,
                col: 0,
            },
            {
                row: grid.height - 1,
                col: grid.width - 1,
            },
        ].map((coord) => grid.get(coord)!);
        for (let i = 0; i < nSteps; i++) {
            step(grid, stuckOn);
        }
        return grid.filter((node) => node.isOn).length;
    },
});

function step(grid: Grid<Node>, stuckOn?: Node[]) {
    const currentValues = new Map<Node, boolean>();
    stuckOn?.forEach((node) => {
        node.isOn = true;
    });
    grid.forEach((node) => {
        if (!node) return;
        currentValues.set(node, node.isOn);
    });
    grid.forEach((node) => {
        if (!node) return;
        const neighbors = grid.getAllNeighborsOf(node.row, node.col);
        const nOn = neighbors.filter((n) => currentValues.get(n)).length;
        if (node.isOn) {
            node.isOn = nOn === 2 || nOn === 3;
        } else {
            node.isOn = nOn === 3;
        }
    });
    stuckOn?.forEach((node) => {
        node.isOn = true;
    });
}
