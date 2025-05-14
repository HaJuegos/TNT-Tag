/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { ItemLockMode, ItemStack, InputPermissionCategory, world } from "@minecraft/server";
/**
 * Funcion de los eventos de los companion cube.
 * @param {Player} ply Jugador golpeado por el cubo
 * @param {Entity} projectile Proyectil en cuestion.
 * @returns {void}
 */
export function companionHit(ply) {
    ply.runCommand(`playsound item.companion_cube.hit_player @a ~~~`);
    ply.runCommand(`particle ha:cube_particle ~~0.5~`);
    ply.runCommand(`particle ha:deleted_particle ~~0.5~`);
    ply.runCommand(`camerashake add @a[r=12] 2.0 0.5`);
    ply.runCommand(`function system/dead_cube`);
}
/**
 * Funcion encargada de los eventos cuando una net golpea a un jugador.
 * @param {Player} hitEntity Jugador golpeado en cuestion
 * @returns {void}
 */
export function netEvents(hitEntity) {
    const obj = world.scoreboard.getObjective('timerNet');
    obj?.setScore(hitEntity, 5);
    hitEntity.inputPermissions.setPermissionCategory(InputPermissionCategory.Movement, false);
    hitEntity.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, false);
    hitEntity.inputPermissions.setPermissionCategory(InputPermissionCategory.Sneak, false);
    hitEntity.triggerEvent('ha:set_net');
    hitEntity.camera.setCamera('minecraft:third_person');
    hitEntity.addTag('inNet');
    hitEntity.runCommand(`playsound item.net_gun.hit @a ~~~`);
    hitEntity.runCommand(`playsound item.net_gun.hit_player @a ~~~`);
}
/**
 * Funcion encargada del projectil de la tnt cuando golpea un bloque.
 * @param {Player} ply Jugador que lanzo el proyectil.
 * @returns {void}
 */
export function returnTnTItem(ply) {
    const inv = ply.getComponent('inventory')?.container;
    const tntItem = new ItemStack('ha:tnt_projectile');
    tntItem.lockMode = ItemLockMode.slot;
    if (inv) {
        for (let i = 0; i < inv.size; i++) {
            const item = inv.getItem(i);
            if (item && item.typeId == tntItem.typeId) {
                return;
            }
        }
        inv?.addItem(tntItem);
        ply.playSound('ui.powerup.in_cooldown');
        ply.sendMessage({ translate: "chat.error_nohittnt" });
    }
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
