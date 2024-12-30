import { Puzzle } from './Puzzle';
import { getMultilineNumbers, splitFilter } from '~/util/parsing';

interface Item {
    name: string;
    cost: number;
    damage: number;
    armor: number;
}

interface Player {
    hp: number;
    damage: number;
    armor: number;
}

export const puzzle21 = new Puzzle({
    day: 21,
    parseInput: (fileData, { example }) => {
        const [hp, damage, armor] = getMultilineNumbers(fileData) as [
            number,
            number,
            number,
        ];
        const boss: Player = {
            hp,
            damage,
            armor,
        };
        return {
            boss,
            itemCombos: getItemCombos(),
            isExample: example,
        };
    },
    part1: ({ boss, itemCombos, isExample }) => {
        const basePlayer: Player = {
            hp: isExample ? 8 : 100,
            damage: 0,
            armor: 0,
        };

        let minCost = Infinity;
        for (const items of itemCombos) {
            const player = { ...basePlayer };
            for (const item of items) {
                player.damage += item.damage;
                player.armor += item.armor;
            }
            if (battle(player, { ...boss })) {
                const inventoryCost = items.reduce(
                    (acc, item) => acc + item.cost,
                    0,
                );
                minCost = Math.min(minCost, inventoryCost);
            }
        }

        return minCost;
    },
    part2: ({ boss, itemCombos }) => {
        const basePlayer: Player = {
            hp: 100,
            damage: 0,
            armor: 0,
        };

        let maxCost = 0;
        for (const items of itemCombos) {
            const player = { ...basePlayer };
            for (const item of items) {
                player.damage += item.damage;
                player.armor += item.armor;
            }
            if (!battle(player, { ...boss })) {
                const inventoryCost = items.reduce(
                    (acc, item) => acc + item.cost,
                    0,
                );
                maxCost = Math.max(maxCost, inventoryCost);
            }
        }

        return maxCost;
    },
});

function parseInventory(inventory: string): Item[] {
    return splitFilter(inventory).map((line) => {
        const [name, cost, damage, armor] = line.split(/\s+/);
        return {
            name: name!,
            cost: Number(cost),
            damage: Number(damage),
            armor: Number(armor),
        };
    });
}

function attack(attacker: Player, defender: Player) {
    const damageDealt = Math.max(attacker.damage - defender.armor, 1);
    defender.hp -= damageDealt;
}

function battle(player: Player, boss: Player) {
    while (player.hp > 0 && boss.hp > 0) {
        attack(player, boss);
        if (boss.hp <= 0) {
            return true;
        }
        attack(boss, player);
    }
    return player.hp > 0;
}

function getItemCombos(): Item[][] {
    const weaponItems = parseInventory(`
Dagger        8     4       0
Shortsword   10     5       0
Warhammer    25     6       0
Longsword    40     7       0
Greataxe     74     8       0`);
    const armorItems = parseInventory(`
Leather      13     0       1
Chainmail    31     0       2
Splintmail   53     0       3
Bandedmail   75     0       4
Platemail   102     0       5`);
    const ringItems = parseInventory(`
Damage+1    25     1       0
Damage+2    50     2       0
Damage+3   100     3       0
Defense+1   20     0       1
Defense+2   40     0       2
Defense+3   80     0       3`);

    const justWeapons: Item[][] = weaponItems.map((weapon) => [weapon]);
    const weaponsAndArmor: Item[][] = armorItems.flatMap((armor) =>
        justWeapons.map((combo) => [...combo, armor]),
    );
    const combosWithoutRings: Item[][] = [...justWeapons, ...weaponsAndArmor];
    const combosWithOneRing: Item[][] = ringItems.flatMap((ring) =>
        combosWithoutRings.map((combo) => [...combo, ring]),
    );
    const combosWithTwoRings: Item[][] = [];
    for (const ring of ringItems) {
        for (const ring2 of ringItems) {
            if (ring2 === ring) {
                continue;
            }
            combosWithTwoRings.push(
                ...combosWithoutRings.map((combo) => [...combo, ring, ring2]),
            );
        }
    }
    return [...combosWithoutRings, ...combosWithOneRing, ...combosWithTwoRings];
}
