import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';
import { Grid, GridNode } from '~/types/Grid';

type Operation = 'on' | 'off' | 'toggle';
interface Instruction {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    operation: Operation;
}

class Node extends GridNode {
    on = false;
    brightness = 0;

    operate1(operation: Operation) {
        switch (operation) {
            case 'on':
                this.on = true;
                break;
            case 'off':
                this.on = false;
                break;
            case 'toggle':
                this.on = !this.on;
                break;
        }
    }

    operate2(operation: Operation) {
        switch (operation) {
            case 'on':
                this.brightness++;
                break;
            case 'off':
                this.brightness = Math.max(0, this.brightness - 1);
                break;
            case 'toggle':
                this.brightness += 2;
                break;
        }
    }
}

export const puzzle6 = new Puzzle({
    day: 6,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line): Instruction => {
            const [minX, minY, maxX, maxY] = getNumbers(line) as [
                number,
                number,
                number,
                number,
            ];
            const operation = line.startsWith('turn on')
                ? 'on'
                : line.startsWith('turn off')
                  ? 'off'
                  : 'toggle';

            return { minX, minY, maxX, maxY, operation };
        });
    },
    part1: (instructions) => {
        const grid = new Grid<Node>({
            maxX: 999,
            maxY: 999,
            defaultValue: (row, col) => new Node({ row, col }),
        });
        for (const instruction of instructions) {
            for (let row = instruction.minY; row <= instruction.maxY; row++) {
                for (
                    let col = instruction.minX;
                    col <= instruction.maxX;
                    col++
                ) {
                    grid.get({ row, col })!.operate1(instruction.operation);
                }
            }
        }
        return grid.filter((node) => node.on).length;
    },
    part2: (instructions) => {
        const grid = new Grid<Node>({
            maxX: 999,
            maxY: 999,
            defaultValue: (row, col) => new Node({ row, col }),
        });
        for (const instruction of instructions) {
            for (let row = instruction.minY; row <= instruction.maxY; row++) {
                for (
                    let col = instruction.minX;
                    col <= instruction.maxX;
                    col++
                ) {
                    grid.get({ row, col })!.operate2(instruction.operation);
                }
            }
        }
        return grid.reduce((sum, node) => sum + node!.brightness, 0);
    },
});
