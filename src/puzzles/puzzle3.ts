import { Puzzle } from './Puzzle';
import { splitFilter } from '~/util/parsing';
import {
    CharDirectionMap,
    Grid,
    GridCoordinate,
    GridCoordinateSet,
} from '~/types/Grid';

export const puzzle3 = new Puzzle({
    day: 3,
    parseInput: (fileData) => {
        return splitFilter(fileData, '').map((char) => CharDirectionMap[char]!);
    },
    part1: (directions) => {
        const visited = new GridCoordinateSet();
        let current: GridCoordinate = {
            row: 0,
            col: 0,
        };
        visited.add(current);
        for (const direction of directions) {
            current = Grid.getCoordsInDirection(
                current.row,
                current.col,
                direction,
            );
            visited.add(current);
        }
        return visited.size;
    },
    part2: (directions) => {
        const visited = new GridCoordinateSet();
        let santa: GridCoordinate = {
            row: 0,
            col: 0,
        };
        let robot: GridCoordinate = {
            row: 0,
            col: 0,
        };
        visited.add(santa);
        visited.add(robot);
        for (let i = 0; i < directions.length; i += 2) {
            const santaDirection = directions[i];
            if (santaDirection) {
                santa = Grid.getCoordsInDirection(
                    santa.row,
                    santa.col,
                    santaDirection,
                );
                visited.add(santa);
            }
            const robotDirection = directions[i + 1];
            if (robotDirection) {
                robot = Grid.getCoordsInDirection(
                    robot.row,
                    robot.col,
                    robotDirection,
                );
                visited.add(robot);
            }
        }
        return visited.size;
    },
});
