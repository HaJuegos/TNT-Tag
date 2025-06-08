/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { CustomComponentBase } from "../types";

/**
 * Eventos que pasan para el componente de lanzar jugadores.
 * @type {CustomComponentBase}
 */
const plyEvent: CustomComponentBase = {
    name: 'ha:player_projectile_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            const item = new mc.ItemStack('ha:player_projectile');

            if (!(ply instanceof mc.Player)) return;

            ply.runCommand(`scriptevent ha:is_attack`);
            addAllCooldown(item);
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

export { plyEvent };

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */