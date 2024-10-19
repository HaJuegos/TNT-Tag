/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, system } from "@minecraft/server";
import { overworld, ticksConvertor } from "../principal/worldStart";

const excludeItems = [
    'ha:rolling_players',
    'ha:super_compass',
    'ha:tnt_item_hand'
];

/**
 * Logica de las flechas cuando un jugador recibe daño de este.
 * @param {Player} hitPlayer Jugador en cuestion.
 * @returns {Void}
 */
export function checkArrowDamage(hitPlayer) {
    const coords = hitPlayer.location;
    const inv = hitPlayer.getComponent('inventory')?.container;

    // @ts-ignore
    for (let i = 0; i < inv?.length; i++) {
        const item = inv?.getItem(i);

        // @ts-ignore
        if (!excludeItems.includes(item?.typeId)) {
            inv?.setItem(i, undefined);

            system.runTimeout(() => {
                // @ts-ignore
                overworld.spawnItem(item, { x: coords.x, y: coords.y + 1.5, z: coords.z });
            }, ticksConvertor(0.85));
        };
    };
};

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */