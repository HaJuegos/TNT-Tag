/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, world } from "@minecraft/server";

import { PowerUpBase } from "../types";
import { getAllEntitiesInAllDime } from "../../globalVariables";

/**
 * Llamada de los eventos de la variante del Clock.
 * @type {PowerUpBase}
 */
const clockEvent: PowerUpBase = {
    variantID: 8,
    cooldownPly: 5,
    events: {
        onlyTntEvents() {
            addTimerClock();
        },
        onlyPlyEvents(source) {
            if (source instanceof Player) {
                source.sendMessage({ translate: "chat.notnt_item" });
                source.playSound('ui.powerup.in_cooldown');
            }
        },
        noCooldown: {
            plys: true
        }
    },
    specificCooldown: {
        all: true
    }
};

/**
 * Funcion encargada de los eventos del Clock.
 * @returns {void}
*/
function addTimerClock(): void {
    const entities = getAllEntitiesInAllDime({ type: 'ha:sensor', tags: ['gameStarted'] });
    const obj = world.scoreboard.getObjective('timerGame');

    for (const entity of entities) {
        obj?.setScore(entity, 25);
    }

    world.sendMessage({ translate: "chat.timerreset" });
    world.getDimension('overworld').runCommand(`execute as @a at @s run playsound entity.powerups.clock`);
}

export { clockEvent };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */