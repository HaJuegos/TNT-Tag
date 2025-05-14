/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, world } from "@minecraft/server";

import { PowerUpBase } from "../types";
import { ticksConvertor } from "../../globalVariables";

/**
 * Llamada de los eventos de la variante del Blindness.
 * @type {PowerUpBase}
 */
const blindEvent: PowerUpBase = {
    variantID: 2,
    cooldownPly: 5,
    events: {
        onlyTntEvents() {
            addBlindness(world.getAllPlayers().filter(ply => ply.hasTag('normalPly')), true);
        },
        onlyPlyEvents() {
            addBlindness(world.getAllPlayers().filter(ply => ply.hasTag('tntPly')));
        }
    },
    specificCooldown: {
        all: true
    }
};

/**
 * Funcion encargada de ejecutar los eventos.
 * @param {Player[]} plys Array de Jugadores en cuestion
 * @param {boolean} isTnt (Opcional) Esta en false por defecto para que esto solo afecte a los jugadores normales y en caso contrario, a los jugadores con la TNT.
 * @returns {void}
 */
function addBlindness(plys: Player[], isTnt: boolean = false): void {
    const msg = (isTnt) ? "chat.debuff_blindness_tnt" : "chat.debuff_blidness";

    world.sendMessage({ translate: msg });
    world.getDimension('overworld').runCommand(`execute as @a at @s run playsound entity.powerups.blindness`);

    for (const ply of plys) {
        ply.addEffect('blindness', ticksConvertor(6), { showParticles: false });
    }
}

export { blindEvent };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */