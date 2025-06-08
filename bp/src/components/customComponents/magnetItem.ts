/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { CustomComponentBase } from "../types";

/**
 * Eventos que suceden con el item Magnet.
 * @type {CustomComponentBase}
 */
const magnetItemEvent: CustomComponentBase = {
    name: 'ha:magnet_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;

            if (!(ply instanceof mc.Player)) return;

            const item = new mc.ItemStack('ha:magnet');
            const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;

            addAllCooldown(item);

            inv?.setItem(ply.selectedSlotIndex, undefined);
			ply.runCommand(`tp @e[type=item] @s`);
            ply.sendMessage({ translate: "chat.item_used.magnet" });
            ply.playSound('ui.item_used.magnet');
        }
    }
};

/**
 * Añade un cooldown de un item a todos los Jugadores.
 * @param {mc.ItemStack} item Item en cuestion.
 * @returns {void}
 */
function addAllCooldown(item: mc.ItemStack): void {
    const cooldown = item.getComponent('cooldown');

    for (const ply of mc.world.getAllPlayers()) {
        cooldown?.startCooldown(ply);
    }
}


export default magnetItemEvent;

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */