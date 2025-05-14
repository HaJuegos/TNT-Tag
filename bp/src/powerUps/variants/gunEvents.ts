/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { EntityComponentTypes, ItemLockMode, ItemStack } from "@minecraft/server";

import { PowerUpBase } from "../types";

/**
 * Llamada de los eventos de la variante Gun.
 * @type {PowerUpBase}
 */
const gunEvent: PowerUpBase = {
    variantID: 11,
    events: {
        allEvents(source) {
            const inv = source.getComponent(EntityComponentTypes.Inventory)?.container;
            const item = new ItemStack('ha:net_gun', 3);

            item.lockMode = ItemLockMode.inventory;
            item.setLore(["This weapon, when hitting a player, will temporarily trap\nhim for a few seconds.", "", "Esta arma al impactar con un jugador, lo atrapara temporalmente\npor unos segundos."]);

            inv?.addItem(item);
        }
    }
};

export { gunEvent };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */