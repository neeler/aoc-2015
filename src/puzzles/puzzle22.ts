import { Puzzle } from './Puzzle';
import { getMultilineNumbers } from '~/util/parsing';
import { PriorityQueue } from '~/types/PriorityQueue';

interface Boss {
    hp: number;
    damage: number;
}

interface Player {
    hp: number;
    mana: number;
}

interface Effect {
    name: string;
    duration: number;
    armor?: number;
    damage?: number;
    mana?: number;
}

export const puzzle22 = new Puzzle({
    day: 22,
    parseInput: (fileData, { example }) => {
        const [hp, damage] = getMultilineNumbers(fileData) as [number, number];
        const boss: Boss = {
            hp,
            damage,
        };
        return {
            boss,
            isExample: example,
        };
    },
    part1: ({ boss, isExample }) => {
        return getMinManaToWin({
            player: isExample
                ? {
                      hp: 10,
                      mana: 250,
                  }
                : {
                      hp: 50,
                      mana: 500,
                  },
            boss,
        });
    },
    part2: ({ boss, isExample }) => {
        return getMinManaToWin({
            player: isExample
                ? {
                      hp: 10,
                      mana: 250,
                  }
                : {
                      hp: 50,
                      mana: 500,
                  },
            boss,
            mode: 'hard',
        });
    },
});

function getMinManaToWin({
    player: startingPlayer,
    boss,
    mode = 'normal',
}: {
    player: Player;
    boss: Boss;
    mode?: 'normal' | 'hard';
}) {
    const queue = new PriorityQueue<{
        player: Player;
        boss: Boss;
        playerEffects: Effect[];
        bossEffects: Effect[];
        manaSpent: number;
        turn: 'player' | 'boss';
    }>({
        compare: (a, b) => a.manaSpent - b.manaSpent,
    });
    queue.add({
        player: startingPlayer,
        boss,
        playerEffects: [],
        bossEffects: [],
        manaSpent: 0,
        turn: 'player',
    });

    let minCost = Infinity;

    queue.process(
        ({ player, boss, playerEffects, bossEffects, manaSpent, turn }) => {
            if (manaSpent >= minCost) {
                return;
            }

            const nextPlayer = { ...player };
            const nextBoss = { ...boss };

            if (mode === 'hard' && turn === 'player') {
                nextPlayer.hp -= 1;
            }
            if (nextPlayer.hp <= 0) {
                return;
            }
            if (nextBoss.hp <= 0) {
                minCost = Math.min(minCost, manaSpent);
                return;
            }

            const playerArmor = playerEffects.reduce(
                (acc, effect) => acc + (effect.armor ?? 0),
                0,
            );
            const damageToBoss = bossEffects.reduce(
                (acc, effect) => acc + (effect.damage ?? 0),
                0,
            );
            nextBoss.hp -= damageToBoss;
            if (nextBoss.hp <= 0) {
                minCost = Math.min(minCost, manaSpent);
                return;
            }

            const manaGained = playerEffects.reduce(
                (acc, effect) => acc + (effect.mana ?? 0),
                0,
            );
            nextPlayer.mana += manaGained;

            const nextPlayerEffects = updateEffects(playerEffects);
            const nextBossEffects = updateEffects(bossEffects);

            if (turn === 'boss') {
                const bossDamage = Math.max(boss.damage - playerArmor, 1);
                nextPlayer.hp -= bossDamage;

                if (nextPlayer.hp <= 0) {
                    // Player dead
                    return;
                }

                queue.add({
                    player: nextPlayer,
                    boss: nextBoss,
                    playerEffects: nextPlayerEffects,
                    bossEffects: nextBossEffects,
                    manaSpent,
                    turn: 'player',
                });
                return;
            }

            if (player.mana < 53) {
                // Not enough mana
                return;
            }

            // Magic Missile
            queue.add({
                player: {
                    ...nextPlayer,
                    mana: nextPlayer.mana - 53,
                },
                boss: {
                    ...nextBoss,
                    hp: nextBoss.hp - 4,
                },
                playerEffects: nextPlayerEffects,
                bossEffects: nextBossEffects,
                manaSpent: manaSpent + 53,
                turn: 'boss',
            });

            if (player.mana < 73) {
                // Not enough mana
                return;
            }

            // Drain
            queue.add({
                player: {
                    ...nextPlayer,
                    hp: nextPlayer.hp + 2,
                    mana: nextPlayer.mana - 73,
                },
                boss: {
                    ...nextBoss,
                    hp: nextBoss.hp - 2,
                },
                playerEffects: nextPlayerEffects,
                bossEffects: nextBossEffects,
                manaSpent: manaSpent + 73,
                turn: 'boss',
            });

            if (player.mana < 113) {
                // Not enough mana
                return;
            }

            if (!nextPlayerEffects.some((effect) => effect.name === 'Shield')) {
                // Shield
                queue.add({
                    player: {
                        ...nextPlayer,
                        mana: nextPlayer.mana - 113,
                    },
                    boss: nextBoss,
                    playerEffects: [
                        ...nextPlayerEffects,
                        {
                            name: 'Shield',
                            duration: 6,
                            armor: 7,
                        },
                    ],
                    bossEffects: nextBossEffects,
                    manaSpent: manaSpent + 113,
                    turn: 'boss',
                });
            }

            if (player.mana < 173) {
                // Not enough mana
                return;
            }

            if (!nextBossEffects.some((effect) => effect.name === 'Poison')) {
                // Poison
                queue.add({
                    player: {
                        ...nextPlayer,
                        mana: nextPlayer.mana - 173,
                    },
                    boss: nextBoss,
                    playerEffects: nextPlayerEffects,
                    bossEffects: [
                        ...nextBossEffects,
                        {
                            name: 'Poison',
                            duration: 6,
                            damage: 3,
                        },
                    ],
                    manaSpent: manaSpent + 173,
                    turn: 'boss',
                });
            }

            if (player.mana < 229) {
                // Not enough mana
                return;
            }

            if (
                !nextPlayerEffects.some((effect) => effect.name === 'Recharge')
            ) {
                // Recharge
                queue.add({
                    player: {
                        ...nextPlayer,
                        mana: nextPlayer.mana - 229,
                    },
                    boss: nextBoss,
                    playerEffects: [
                        ...nextPlayerEffects,
                        {
                            name: 'Recharge',
                            duration: 5,
                            mana: 101,
                        },
                    ],
                    bossEffects: nextBossEffects,
                    manaSpent: manaSpent + 229,
                    turn: 'boss',
                });
            }
        },
    );

    return minCost;
}

function updateEffects(effects: Effect[]) {
    return effects
        .map((effect) => ({
            ...effect,
            duration: effect.duration - 1,
        }))
        .filter((effect) => effect.duration > 0);
}
