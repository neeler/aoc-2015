import { Puzzle } from './Puzzle';
import { getNumbers, splitFilter } from '~/util/parsing';

interface Ingredient {
    name: string;
    capacity: number;
    durability: number;
    flavor: number;
    texture: number;
    calories: number;
}

type Recipe = Map<Ingredient, number>;

export const puzzle15 = new Puzzle({
    day: 15,
    parseInput: (fileData) => {
        return splitFilter(fileData).map((line): Ingredient => {
            const [name, properties] = line.split(':') as [string, string];
            const [capacity, durability, flavor, texture, calories] =
                getNumbers(properties) as [
                    number,
                    number,
                    number,
                    number,
                    number,
                ];
            return {
                name,
                capacity,
                durability,
                flavor,
                texture,
                calories,
            };
        });
    },
    part1: (ingredients) => {
        interface RecipeDraft {
            amounts: Recipe;
            remaining: number;
        }
        let recipes: RecipeDraft[] = [
            {
                amounts: new Map(),
                remaining: 100,
            },
        ];
        for (const [iIngredient, ingredient] of ingredients.entries()) {
            const nextRecipes: RecipeDraft[] = [];
            for (const { amounts, remaining } of recipes) {
                const minAmount =
                    iIngredient === ingredients.length - 1 ? remaining : 1;
                for (let i = minAmount; i <= remaining; i++) {
                    const nextAmounts = new Map(amounts);
                    nextAmounts.set(ingredient, i);
                    nextRecipes.push({
                        amounts: nextAmounts,
                        remaining: remaining - i,
                    });
                }
            }
            recipes = nextRecipes;
        }

        return recipes
            .map(({ amounts }) => scoreRecipe(amounts))
            .reduce((max, score) => Math.max(max, score), 0);
    },
    part2: (ingredients) => {
        const targetCalories = 500;
        interface RecipeDraft {
            amounts: Recipe;
            calories: number;
            remaining: number;
        }
        let recipes: RecipeDraft[] = [
            {
                amounts: new Map(),
                calories: 0,
                remaining: 100,
            },
        ];
        for (const [iIngredient, ingredient] of ingredients.entries()) {
            const nextRecipes: RecipeDraft[] = [];
            for (const { amounts, calories, remaining } of recipes) {
                const minAmount =
                    iIngredient === ingredients.length - 1 ? remaining : 1;
                const maxAmount = Math.min(
                    Math.floor(
                        (targetCalories - calories) / ingredient.calories,
                    ),
                    remaining,
                );
                for (let i = minAmount; i <= maxAmount; i++) {
                    const nextAmounts = new Map(amounts);
                    nextAmounts.set(ingredient, i);
                    nextRecipes.push({
                        amounts: nextAmounts,
                        calories: calories + ingredient.calories * i,
                        remaining: remaining - i,
                    });
                }
            }
            recipes = nextRecipes;
        }

        return recipes
            .filter(({ calories }) => calories === targetCalories)
            .map(({ amounts }) => scoreRecipe(amounts))
            .reduce((max, score) => Math.max(max, score), 0);
    },
});

function scoreRecipe(recipe: Recipe) {
    let capacity = 0;
    let durability = 0;
    let flavor = 0;
    let texture = 0;
    for (const [ingredient, amount] of recipe.entries()) {
        capacity += ingredient.capacity * amount;
        durability += ingredient.durability * amount;
        flavor += ingredient.flavor * amount;
        texture += ingredient.texture * amount;
    }
    return (
        Math.max(0, capacity) *
        Math.max(0, durability) *
        Math.max(0, flavor) *
        Math.max(0, texture)
    );
}
