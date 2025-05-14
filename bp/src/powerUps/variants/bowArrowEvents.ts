/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { EntityComponentTypes, ItemLockMode, ItemStack } from "@minecraft/server";

import { PowerUpBase } from "../types";

/**
 * Llamada de los eventos de la variante Bow & Arrow.
 * @type {PowerUpBase}
 */
const bowArrowEvent: PowerUpBase = {
    variantID: 4,
    events: {
        allEvents(source) {
            const inv = source.getComponent(EntityComponentTypes.Inventory)?.container;
            const items = [new ItemStack('minecraft:bow', 1), new ItemStack('minecraft:arrow', 3)];

            for (const item of items) {
                item.lockMode = ItemLockMode.inventory;
                inv?.addItem(item);
            }
        }
    }
};

export { bowArrowEvent };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */