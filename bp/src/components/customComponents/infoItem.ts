/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { CustomComponentBase } from "../types";
import { showInfoPly } from "../../functions/stadisticFn";

/**
 * Eventos que pasan para el componente de informacion.
 * @type {CustomComponentBase}
 */
const infoItem: CustomComponentBase = {
    name: 'ha:info_item_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            const item = new mc.ItemStack('ha:info_item');

            if (!(ply instanceof mc.Player)) return;

            startCooldown(item, ply);
            showInfoPly(ply);
        }
    }
};

/**
 * Funcion encargada de iniciar el cooldown del item al jugador que lo uso.
 * @param {mc.ItemStack} item Item en cuestion
 * @param {mc.Player} ply Jugador en cuestion
 * @returns {Void}
 */
function startCooldown(item: mc.ItemStack, ply: mc.Player): void {
    const cooldown = item.getComponent('cooldown');

    cooldown?.startCooldown(ply);
}

export { infoItem };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */