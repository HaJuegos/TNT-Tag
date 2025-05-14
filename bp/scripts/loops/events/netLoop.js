/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { InputPermissionCategory, Player, world } from "@minecraft/server";
/**
 * Eventos del timer de la net.
 * @type {TimerLoopBase}
 */
const netLoop = {
    obj: "timerNet",
    entities: () => world.getAllPlayers().filter(ply => ply.hasTag('inNet')),
    onTick(entity) {
        if (entity instanceof Player) {
            const randomX = (Math.random() - 0.5) * 0.9;
            const randomZ = (Math.random() - 0.5) * 0.9;
            entity.applyKnockback({ x: randomX, z: randomZ }, 0.25);
        }
    },
    onComplete(entity) {
        if (entity instanceof Player) {
            removeNet(entity);
        }
    }
};
/**
 * Funcion encargada de eliminar los eventos de la net.
 * @param {Player} ply Jugador en cuestion.
 * @returns {void}
 */
function removeNet(ply) {
    ply.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, true);
    ply.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, true);
    ply.inputPermissions.setPermissionCategory(InputPermissionCategory.Sneak, true);
    ply.triggerEvent('ha:remove_net');
    ply.camera.clear();
    ply.removeTag('inNet');
    ply.runCommand(`particle minecraft:knockback_roar_particle ~~~`);
    ply.runCommand(`ride @s stop_riding`);
}
export { netLoop };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
