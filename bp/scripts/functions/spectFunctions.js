/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player } from "@minecraft/server";

import { getSpecificEntities } from "../principal/worldStart";

/**
 * Funcion que maneja los comandos custom cuando estas en modo espectador en una ronda.
 * @param {Player} player Jugador en cuestion
 * @param {String} msg Mensaje con posibles argumentos.
 * @returns {Void}
 */
export function commandsSpect(player, msg) {
    if (msg.includes('!tphunter')) {
        const players = getSpecificEntities({ type: 'minecraft:player', tags: ['tntPlayer'] });
        const randomIndex = Math.floor(Math.random() * players.length);
        const randomPlayer = players[randomIndex];
        const randomCoords = randomPlayer.location;
        const randomDime = randomPlayer.dimension;
        const randomView = randomPlayer.getViewDirection();

        player.tryTeleport(randomCoords, { dimension: randomDime, facingLocation: randomView });
    };

    if (msg.includes('!tpplayer')) {
        const players = getSpecificEntities({ type: 'minecraft:player', tags: ['player'] });
        const randomIndex = Math.floor(Math.random() * players.length);
        const randomPlayer = players[randomIndex];
        const randomCoords = randomPlayer.location;
        const randomDime = randomPlayer.dimension;
        const randomView = randomPlayer.getViewDirection();

        player.tryTeleport(randomCoords, { dimension: randomDime, facingLocation: randomView });
    };
};

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */