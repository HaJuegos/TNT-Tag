/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { world } from "@minecraft/server";

import { PowerUpBase } from "../types";
import { getAllEntitiesInAllDime } from "../../globalVariables";

/**
 * Eventos de la variante BrokenClock.
 * @type {PowerUpBase}
 */
const brokenClockEvents: PowerUpBase = {
    variantID: 13,
    cooldownPly: 20,
    specificCooldown: {
        all: true
    },
    events: {
        onlyPlyEvents(source) {
            removeTimerClock();
        },
        noCooldown: {
            tnt: true
        }
    }
};

/**
 * Funcion que remueve tiempo al reloj del juego
 * @returns {void}
*/
function removeTimerClock(): void {
	const entities = getAllEntitiesInAllDime({ type: 'ha:game_entity', tags: ['inGame'] });
    const obj = world.scoreboard.getObjective('timerInGame');
    const removeTime = 10;

    for (const entity of entities) {
        const current = obj?.getScore(entity) ?? 0;
        const newScore = Math.max(current - removeTime, 0);
		
        obj?.setScore(entity, newScore);
    }

    world.sendMessage({ translate: "chat.timerbroken" });
    world.getDimension('overworld').runCommand(`execute as @a at @s run playsound entity.powerups.clock`);
}

export default brokenClockEvents;

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */