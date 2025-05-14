/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Eventos que pasan para el componente de la wing.
 * @type {CustomComponentBase}
 */
const wingEvent = {
    name: 'ha:wing_event',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            const item = new mc.ItemStack('ha:wing');
            if (!(ply instanceof mc.Player))
                return;
            startCooldown(item, ply);
            wingEvents(ply);
        }
    }
};
/**
 * Funcion encargada de los eventos que se ejecutan cuando se usa el item.
 * @param {mc.Player} ply Jugador que uso el item
 * @returns {Void}
 */
function wingEvents(ply) {
    const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;
    const armorInv = ply.getComponent(mc.EntityComponentTypes.Equippable);
    const slots = [mc.EquipmentSlot.Head, mc.EquipmentSlot.Chest, mc.EquipmentSlot.Legs, mc.EquipmentSlot.Feet];
    inv?.setItem(ply.selectedSlotIndex, undefined);
    let multiplier = 1.15;
    if (armorInv) {
        for (const slot of slots) {
            const equippedItem = armorInv.getEquipment(slot);
            if (equippedItem?.typeId == "minecraft:netherite_helmet" ||
                equippedItem?.typeId == "minecraft:netherite_chestplate" ||
                equippedItem?.typeId == "minecraft:netherite_leggings" ||
                equippedItem?.typeId == "minecraft:netherite_boots") {
                multiplier += 0.1;
            }
        }
    }
    const viewVector = ply.getViewDirection();
    const horizontalForce = { x: viewVector.x * multiplier, z: viewVector.z * multiplier };
    ply.spawnParticle('minecraft:knockback_roar_particle', ply.location);
    ply.playSound('mob.enderdragon.flap');
    ply.applyKnockback(horizontalForce, 1.4);
}
/**
 * Funcion encargada de iniciar el cooldown del item al jugador que lo uso.
 * @param {mc.ItemStack} item Item en cuestion
 * @param {mc.Player} ply Jugador en cuestion
 * @returns {Void}
 */
function startCooldown(item, ply) {
    const cooldown = item.getComponent('cooldown');
    cooldown?.startCooldown(ply);
}
export { wingEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
