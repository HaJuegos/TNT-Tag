/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { EntityComponentTypes, ItemLockMode, ItemStack, Player } from "@minecraft/server";

import { PowerUpBase } from "../types";

/**
 * Llamada de los eventos de la variante Elytra.
 * @type {PowerUpBase}
 */
const elytraEvent: PowerUpBase = {
    variantID: 10,
    events: {
        allEvents(source) {
            if (!(source instanceof Player)) return;

            const inv = source.getComponent(EntityComponentTypes.Inventory)?.container;
            const items = [new ItemStack('minecraft:elytra', 1), new ItemStack('minecraft:firework_rocket', 3)];

            if (source.hasTag('activatedCoin') || checkHasCoin(source)) {
                source.sendMessage({ translate: "chat.error.nogetwithcoins" });
                source.playSound('ui.powerup.in_cooldown');
                return false;
            }

            for (const item of items) {
                item.lockMode = ItemLockMode.inventory;
                inv?.addItem(item);
            }
        }
    }
};

/**
 * Revisa si el jugador tiene una moneda en su inventario.
 * @param {Player} ply Jugador en cuestion.
 * @returns {boolean} Devuelve true, en caso contrario, false.
 */
function checkHasCoin(ply: Player): boolean {
    const inv = ply.getComponent(EntityComponentTypes.Inventory)?.container;

    if (inv) {
        for (let i = 0; i < inv.size; i++) {
            const item = inv.getItem(i);

            if (item && item.typeId == 'ha:coin') {
                return true;
            }
        }
    }

    return false;
}

export { elytraEvent };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */