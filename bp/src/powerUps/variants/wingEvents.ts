/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { EntityComponentTypes, ItemLockMode, ItemStack } from "@minecraft/server";

import { PowerUpBase } from "../types";

/**
 * Llamada de los eventos de la variante Wing.
 * @type {PowerUpBase}
 */
const wingEvent: PowerUpBase = {
    variantID: 7,
    events: {
        allEvents(source) {
            const inv = source.getComponent(EntityComponentTypes.Inventory)?.container;
            const item = new ItemStack('ha:wing');

            item.lockMode = ItemLockMode.inventory;
            item.setLore(["This item will launch you into the air.", "", "Este item te lanzara por los aires."]);

            inv?.addItem(item);
        }
    }
};

export { wingEvent };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */