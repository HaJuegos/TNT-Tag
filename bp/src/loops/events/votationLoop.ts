/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { DisplaySlotId, ObjectiveSortOrder, world } from "@minecraft/server";

import { getAllEntitiesInAllDime } from "../../globalVariables";
import { TimerLoopBase } from "../types";
import { startGame } from "../../functions/gameFn";

/**
 * Eventos del timer de las votaciones.
 * @type {TimerLoopBase}
 */
const votationLoop: TimerLoopBase = {
    obj: "timerVotations",
    entities: () => getAllEntitiesInAllDime({ type: 'ha:votation_entity', tags: ['inVotations'] }),
    onTick(_, score) {
        for (const ply of world.getAllPlayers()) {
            ply.onScreenDisplay.setActionBar({ translate: "ui.votation_timer", with: { rawtext: [{ text: `${score}` }] } });
        }

        world.getDimension('overworld').runCommand(`execute as @a at @s run playsound random.click @s ~ ~ ~ 50.0 2.0`);
    },
    onComplete(entity) {
        checkVotations();
        resetVotations();
        entity.triggerEvent('ha:despawn');
    }
};

/**
 * Revisa todos los votos de los jugadores para sacar un candidato ganador.
 * @returns {void}
*/
function checkVotations(): void {
    const objVotes = world.scoreboard.getObjective('totalVotes');
    const objWinStack = world.scoreboard.getObjective('winStack');

    if (objVotes && objWinStack) {
        const objScores = objVotes.getScores();

        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: objWinStack, sortOrder: ObjectiveSortOrder.Descending });

        if (objScores.length <= 0) {
            world.sendMessage({ translate: "chat.error.novotes" });
            world.getDimension('overworld').runCommand(`execute as @a at @s run playsound ui.powerup.in_cooldown`);
            resetVotations();
            return;
        }

        let highScore = 0;

        for (const objScore of objScores) {
            if (objScore.score > highScore) {
                highScore = objScore.score;
            }
        }

        const tiedMaps: string[] = [];

        for (const objScore of objScores) {
            const mapName = objScore.participant.displayName;
            const score = objScore.score;

            if (score == highScore) {
                tiedMaps.push(mapName);
            }
        }

        let winnerMap: string;
        let finalMapWin: number = -1;

        if (tiedMaps.length == 1) {
            winnerMap = tiedMaps[0];

            const mapName = winnerMap.split('.')[1];

            if (winnerMap == 'map.random') {
                const randomMapNumber = Math.floor(Math.random() * 10 + 1);

                world.sendMessage({ translate: "chat.random_map_win", with: { rawtext: [{ text: `${randomMapNumber}` }] } });
                finalMapWin = randomMapNumber;
            } else {
                world.sendMessage({ translate: "chat.mapWinnning", with: { rawtext: [{ text: `${mapName}` }, { text: `${highScore}` }] } });
                finalMapWin = Number.parseInt(mapName);
            }
        } else {
            const randomI = Math.floor(Math.random() * tiedMaps.length);

            winnerMap = tiedMaps[randomI];

            const mapName = winnerMap.split('.')[1];

            if (winnerMap == 'map.random') {
                const randomMapNumber = Math.floor(Math.random() * 10 + 1);

                world.sendMessage({ translate: "chat.random_map_win", with: { rawtext: [{ text: `${randomMapNumber}` }] } });
                finalMapWin = randomMapNumber;
            } else {
                world.sendMessage({ translate: "chat.map_equals", with: { rawtext: [{ text: `${mapName}` }] } });
                finalMapWin = Number.parseInt(mapName);
            }

        }
		
        startGame(finalMapWin);
        world.getDimension('overworld').runCommand(`execute as @a at @s run playsound random.levelup`);
        world.getDimension('overworld').runCommand(`clear @a`);
    }
}

/**
 * Funcion que reinicia los votos luego de terminar la votacion.
 * @returns {void}
*/
function resetVotations(): void {
    world.getDimension('overworld').runCommand(`scoreboard players reset * totalVotesView`);
    world.getDimension('overworld').runCommand(`scoreboard players reset * totalVotes`);
    world.getDimension('overworld').runCommand(`tag @a remove alrVoted`);
    world.getDimension('overworld').runCommand(`clear @a ha:calculator`);
}

export { votationLoop };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */