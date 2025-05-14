/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Llamada de los eventos de la variante de la moneda.
 * @type {PowerUpBase}
 */
const coinPowerUp = {
    variantID: 1,
    events: {
        allEvents(source) {
            if (source instanceof mc.Player) {
                if (checkHasElytra(source)) {
                    source.sendMessage({ translate: "chat.error.nogetwithelytras" });
                    source.playSound('ui.powerup.in_cooldown');
                    return false;
                }
                coinEvents(source);
            }
        }
    }
};
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
 * Funcion encargada de los eventos que suceden al interactuar con la entidad.
 * @param {mc.Player} ply Jugador que interactuo.
 * @returns {Void}
 */
function coinEvents(ply) {
    const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;
    const item = new mc.ItemStack('ha:coin');
    item.lockMode = mc.ItemLockMode.inventory;
    item.setLore(["When you use this item, it will temporarily protect\nyou for a few seconds from the player with the TNT.", "", "Al usar este ítem, te protegerá temporalmente\npor unos segundos del jugador con la TNT."]);
    inv?.addItem(item);
}
export { coinPowerUp };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
