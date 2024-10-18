/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, world } from "@minecraft/server";

import { adminStuff } from "../functions/adminFunctions";

/**
 * Objeto que almacena de forma dinámica datos de jugadores que están baneados.
 * @type {{ [playerName: string]: { id: string; isBanned: boolean; }}}
 */
export const bannedPlayersData = {};

world.beforeEvents.chatSend.subscribe(async adminCommands => {
    try {
        const { message: msg, sender: player } = adminCommands;

        if (player.isOp() && msg.startsWith('!')) {
            adminCommands.cancel = true;
            await null;
            adminStuff(player, msg);
        } else if (player.hasTag('muted')) {
            adminCommands.cancel = true;
            await null;
            player.sendMessage({ translate: "chat.ismuted" });
            player.playSound("random.break");
        };
    } catch {};
});

world.afterEvents.playerSpawn.subscribe(checkBan => {
    try {
        const { player } = checkBan;

        if (player.hasTag('ban') && !player.isOp()) {
            if (!bannedPlayersData[player.name]) {
                bannedPlayersData[player.name] = {
                    id: player.id,
                    isBanned: true
                };
            };

            if (bannedPlayersData[player.name] && !bannedPlayersData[player.name].isBanned) return;

            player.runCommand(`kick "${player.name}" `);
        };
    } catch {};
});

/**
 * Añade al objecto de datos de usuarios baneados su informacion de forma dinamica.
 * @param {Player} player
 * @returns {Void} Jugador en cuestion
 */
export function saveDataBan(player) {
    bannedPlayersData[player.name] = {
        id: player.id,
        isBanned: true
    };
};

/**
 * Remueve un baneo que se haya realizado en el servidor.
 * @param {String} name Nombre del jugador en cuestion.
 * @param {String} isId ID Unico del jugador.
 * @returns {Void}
 */
export function removeDataBan(name, isId) {
    bannedPlayersData[name] = {
        id: isId,
        isBanned: false
    };
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */