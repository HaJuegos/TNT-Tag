/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Eventos que pasan para el componente de la moneda.
 * @type {CustomComponentBase}
 */
const coinEvent = {
    name: 'ha:coin_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            if (!(ply instanceof mc.Player))
                return;
            if (ply.hasTag('activatedCoin') || ply.hasTag('tntPly') || checkGlowActivated()) {
                ply.sendMessage({ translate: (ply.hasTag('tntPly')) ? "chat.no_coin_activate" : "chat.coin_cooldown" });
                ply.playSound('ui.powerup.in_cooldown');
                return;
            }
            if (checkHasElytra(ply)) {
                ply.sendMessage({ translate: "chat.error.nousewithelytras" });
                ply.playSound('ui.powerup.in_cooldown');
                return;
            }
            const inv = ply.getComponent('inventory')?.container;
            const armorInv = ply.getComponent('equippable');
            const armorItem = new mc.ItemStack('minecraft:netherite_chestplate');
            const item = new mc.ItemStack('ha:coin');
            const timerCoin = mc.world.scoreboard.getObjective('timerCoin');
            const cooldownPower = mc.world.scoreboard.getObjective('cooldownPower');
            armorItem.lockMode = mc.ItemLockMode.slot;
            inv?.setItem(ply.selectedSlotIndex, undefined);
            armorInv?.setEquipment(mc.EquipmentSlot.Chest, armorItem);
            startCooldown(item, ply);
            ply.runCommand(`playsound ui.item.coin_used @a ~~~`);
            ply.addTag('activatedCoin');
            ply.addTag('cooldownPower');
            ply.sendMessage({ translate: "chat.activate_coin" });
            timerCoin?.setScore(ply, 10);
            cooldownPower?.setScore(ply, 10);
        }
    }
};
/**
 * Funcion que revisa si ya esta activado el glowing para evitar repeticiones.
 * @returns {boolean} Devuelve true si ya esta activo, false en caso de que no.
 */
function checkGlowActivated() {
    const entities = mc.world.getDimension('overworld').getEntities({ type: 'ha:glowing_entity', tags: ["glowActivated"] });
    if (entities.length > 0) {
        return true;
    }
    return false;
}
/**
 * Revisa si el Jugador tiene Elytras en su inventario para prohibir usar la moneda.
 * @param {mc.Player} ply
 * @returns {boolean}
 */
function checkHasElytra(ply) {
    const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;
    const armorInv = ply.getComponent(mc.EntityComponentTypes.Equippable);
    if (inv) {
        for (let i = 0; i < inv.size; i++) {
            const item = inv.getItem(i);
            if (item && item.typeId == 'minecraft:elytra') {
                return true;
            }
        }
    }
    if (armorInv) {
        const item = armorInv.getEquipment(mc.EquipmentSlot.Chest);
        if (item && item.typeId == 'minecraft:elytra') {
            return true;
        }
    }
    return false;
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
export { coinEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
