/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { world } from "@minecraft/server";
import { getAllEntitiesInAllDime } from "../../globalVariables";
let inGlow = false;
/**
 * Eventos del timer del Glowing.
 * @type {TimerLoopBase}
 */
const glowLoop = {
    obj: "timerGlow",
    entities: () => getAllEntitiesInAllDime({ type: 'ha:glowing_entity', tags: ["glowActivated"] }),
    onTick: () => {
        inGlow = true;
        addGlowInAllPlys();
    },
    onComplete: (entity) => {
        inGlow = false;
        entity.removeTag('glowActivated');
        entity.triggerEvent('ha:despawn');
        removeGlowAllPlys();
    }
};
/**
 * Funcion encargada de poner glowing a los jugadores.
 * @returns {void}
 */
function addGlowInAllPlys() {
    for (const ply of world.getAllPlayers().filter(ply => !ply.hasTag('spectMode'))) {
        const hasCoin = ply.hasTag('activatedCoin');
        const hasTNT = ply.hasTag('tntPly');
        ply.nameTag = hasTNT ? `§c§l[TNT]§r\n${ply.name}` : hasCoin ? `§e§l[COIN ACTIVATED]§r\n${ply.name}` : `${ply.name}`;
        ply.triggerEvent((hasTNT || hasCoin) ? 'ha:remove_glow' : 'ha:set_glow');
    }
}
/**
 * Funcion encargada de quitar el glowing a los jugadores.
 * @returns {void}
 */
function removeGlowAllPlys() {
    for (const ply of world.getAllPlayers().filter(ply => !ply.hasTag('spectMode'))) {
        const hasCoin = ply.hasTag('activatedCoin');
        ply.nameTag = hasCoin ? `§e§l[COIN ACTIVATED]§r` : `§r`;
        ply.triggerEvent('ha:remove_glow');
    }
    world.sendMessage({ translate: "chat.compass_deactivated" });
    world.getDimension('overworld').runCommand(`time set day`);
    world.getDimension('overworld').runCommand(`execute as @a at @s run playsound mob.zombie.unfect`);
}
export { glowLoop, inGlow };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
