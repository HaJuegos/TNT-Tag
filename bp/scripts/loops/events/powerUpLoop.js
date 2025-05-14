/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { Entity, world } from "@minecraft/server";
import { getAllEntitiesInAllDime } from "../../globalVariables";
/**
 * Eventos del cooldown de los powerups a los jugadores.
 * @type {TimerLoopBase}
 */
const powerUpLoop = {
    obj: "cooldownPower",
    entities: () => [
        ...world.getAllPlayers().filter(ply => ply.hasTag('cooldownPower')),
        ...getAllEntitiesInAllDime({ type: 'ha:power_ups', tags: ['cooldownPower'] })
    ],
    onComplete(entity) {
        entity.removeTag('cooldownPower');
        if (entity instanceof Entity) {
            entity.triggerEvent('minecraft:entity_spawned');
        }
    }
};
export { powerUpLoop };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
