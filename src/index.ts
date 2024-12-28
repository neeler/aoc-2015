import kleur from 'kleur';
import { puzzle1, puzzle2, puzzle3, puzzle4 } from '~/puzzles';
import { Timer } from '~/util/Timer';

async function start() {
    const timer = new Timer();

    // await puzzle1.run();
    // await puzzle2.run();
    // await puzzle3.run();
    await puzzle4.run({
        example: false,
        mainProblem: true,
    });

    console.log(kleur.cyan(`All puzzles ran in ${timer.time}.`));
}

start();
