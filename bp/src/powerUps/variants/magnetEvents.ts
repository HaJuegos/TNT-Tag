/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { EntityComponentTypes, ItemLockMode, ItemStack } from "@minecraft/server";

import { PowerUpBase } from "../types";

/**
 * Eventos que suceden con la variante Magnet.
 * @type {PowerUpBase}
 */
const magnetEvent: PowerUpBase = {
    variantID: 14,
    events: {
        allEvents(source) {
            const inv = source.getComponent(EntityComponentTypes.Inventory)?.container;
            const item = new ItemStack('ha:magnet', 1);

            item.lockMode = ItemLockMode.inventory;
            item.setLore(["When you use this item at the perfect moment, all items dropped on \nthe ground will be teleported to you.", "", "Al usar este ítem en el momento perfecto, todos los ítems dropeados \nen el suelo, se teletransportaran hacia ti."]);

            inv?.addItem(item);
        }
    }
};

export default magnetEvent;

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */