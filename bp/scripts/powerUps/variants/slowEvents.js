/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { world } from "@minecraft/server";
import { ticksConvertor } from "../../globalVariables";
/**
 * Llamada de los eventos de la variante Slow.
 * @type {PowerUpBase}
 */
const slowEvent = {
    variantID: 9,
    cooldownPly: 5,
    events: {
        onlyTntEvents() {
            addSlowness(world.getAllPlayers().filter(ply => ply.hasTag('normalPly')), true);
        },
        onlyPlyEvents() {
            addSlowness(world.getAllPlayers().filter(ply => ply.hasTag('tntPly')));
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
function addSlowness(plys, isTnt = false) {
    const msg = (isTnt) ? "chat.debuff_slowness_tnt" : "chat.debuff_slowness";
    world.sendMessage({ translate: msg });
    world.getDimension('overworld').runCommand(`execute as @a at @s run playsound entity.powerups.blindness`);
    for (const ply of plys) {
        ply.addEffect("slowness", ticksConvertor(4), { amplifier: 9 });
    }
}
export { slowEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
