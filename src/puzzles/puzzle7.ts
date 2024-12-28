import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import { mod } from '~/util/arithmetic';

type GateType = 'AND' | 'OR' | 'LSHIFT' | 'RSHIFT' | 'NOT';
class Gate {
    type: GateType;
    left: Wire | number;
    right?: Wire | number;

    constructor({
        type,
        left,
        right,
    }: {
        type: GateType;
        left: Wire | number;
        right?: Wire | number;
    }) {
        this.type = type;
        this.left = left;
        this.right = right;
    }

    getValue(wireMap: Map<string, Wire>): number {
        const leftValue =
            typeof this.left === 'number'
                ? this.left
                : this.left.getValue(wireMap);

        if (this.type === 'NOT') {
            return ~leftValue;
        }

        if (this.right === undefined) {
            throw new Error(`Gate ${this.type} requires a right value.`);
        }

        const rightValue =
            typeof this.right === 'number'
                ? this.right
                : this.right!.getValue(wireMap);

        switch (this.type) {
            case 'AND':
                return leftValue & rightValue;
            case 'OR':
                return leftValue | rightValue;
            case 'LSHIFT':
                return leftValue << rightValue;
            case 'RSHIFT':
                return leftValue >> rightValue;
        }
    }
}
class Wire {
    name: string;
    value: number | Wire | Gate;
    calculatedValue?: number;

    constructor(name: string) {
        this.name = name;
        this.value = 0;
    }

    getValue(wireMap: Map<string, Wire>): number {
        if (this.calculatedValue !== undefined) {
            return this.calculatedValue;
        }

        if (typeof this.value === 'number') {
            return this.value;
        }

        const value = mod(this.value.getValue(wireMap), 65536);
        this.calculatedValue = value;
        return value;
    }

    reset() {
        this.calculatedValue = undefined;
    }
}

export const puzzle7 = new Puzzle({
    day: 7,
    parseInput: (fileData, { example }) => {
        const wireMap = new Map<string, Wire>();
        const gates = new Set<Gate>();
        splitFilter(fileData).forEach((line) => {
            const [formula, wireName] = line.split(' -> ') as [string, string];

            const wire = wireMap.get(wireName) ?? new Wire(wireName);
            wireMap.set(wireName, wire);

            const wireOrNum = (input: string) => {
                const num = Number.parseInt(input);
                if (Number.isNaN(num)) {
                    const inputWire = wireMap.get(input) ?? new Wire(input);
                    wireMap.set(input, inputWire);
                    return inputWire;
                } else {
                    return num;
                }
            };

            const parts = formula.split(' ');

            switch (parts.length) {
                case 1: {
                    const [input] = parts as [string];
                    wire.value = wireOrNum(input);
                    break;
                }
                case 2: {
                    // NOT gate
                    const [type, left] = parts as [GateType, string];
                    const gate = new Gate({
                        type,
                        left: wireOrNum(left),
                    });
                    gates.add(gate);
                    wire.value = gate;
                    break;
                }
                case 3: {
                    const [left, type, right] = parts as [
                        string,
                        GateType,
                        string,
                    ];
                    const gate = new Gate({
                        type,
                        left: wireOrNum(left),
                        right: wireOrNum(right),
                    });
                    gates.add(gate);
                    wire.value = gate;
                    break;
                }
                default: {
                    throw new Error(`Invalid gate formula: ${formula}`);
                }
            }
        });
        return {
            isExample: example,
            wireMap,
            gates,
        };
    },
    part1: ({ wireMap, isExample }) => {
        const targetWireName = isExample ? 'i' : 'a';
        return wireMap.get(targetWireName)!.getValue(wireMap);
    },
    part2: ({ wireMap, isExample }) => {
        if (isExample) return 0;

        const aValue = wireMap.get('a')!.getValue(wireMap);
        wireMap.forEach((wire) => wire.reset());
        wireMap.get('b')!.calculatedValue = aValue;

        return wireMap.get('a')!.getValue(wireMap);
    },
});
