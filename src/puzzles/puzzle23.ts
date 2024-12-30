import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';

class Computer {
    readonly registers: Record<Register, number> = {
        a: 0,
        b: 0,
    };
    private readonly instructions: Instruction[];

    constructor(instructions: Instruction[]) {
        this.instructions = instructions;
    }

    run() {
        let i = 0;
        while (this.instructions[i]) {
            const { type, offset, register } = this.instructions[i]!;
            switch (type) {
                case 'hlf': {
                    this.registers[register!] = Math.floor(
                        this.registers[register!] / 2,
                    );
                    i++;
                    break;
                }
                case 'tpl': {
                    this.registers[register!] = this.registers[register!] * 3;
                    i++;
                    break;
                }
                case 'inc': {
                    this.registers[register!] = this.registers[register!] + 1;
                    i++;
                    break;
                }
                case 'jmp': {
                    i += offset!;
                    break;
                }
                case 'jie': {
                    if (this.registers[register!] % 2 === 0) {
                        i += offset!;
                    } else {
                        i++;
                    }
                    break;
                }
                case 'jio': {
                    if (this.registers[register!] === 1) {
                        i += offset!;
                    } else {
                        i++;
                    }
                    break;
                }
            }
        }
    }

    reset() {
        this.registers.a = 0;
        this.registers.b = 0;
    }
}

type InstructionType = 'hlf' | 'tpl' | 'inc' | 'jmp' | 'jie' | 'jio';
type Register = 'a' | 'b';

interface Instruction {
    type: InstructionType;
    register?: Register;
    offset?: number;
}

export const puzzle23 = new Puzzle({
    day: 23,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line): Instruction => {
            const parts = line.split(/,?\s/) as [
                string,
                string,
                string | undefined,
            ];
            const isJump = parts[0] === 'jmp';
            return {
                type: parts[0] as InstructionType,
                register: isJump ? undefined : (parts[1] as Register),
                offset: parts[2]
                    ? Number(parts[2])
                    : isJump
                      ? Number(parts[1])
                      : undefined,
            };
        });
    },
    part1: (instructions) => {
        const computer = new Computer(instructions);
        computer.run();
        return computer.registers.b;
    },
    part2: (instructions) => {
        const computer = new Computer(instructions);
        computer.registers.a = 1;
        computer.run();
        return computer.registers.b;
    },
});
