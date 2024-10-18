/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player } from "@minecraft/server";

import { getSpecificEntities } from "../principal/worldStart";
import { bannedPlayersData, removeDataBan, saveDataBan } from "../principal/adminCommands";

/**
 * Logica que se ejecuta cuando se activa un comando de Administracion.
 * @param {Player} player Jugador en cuestion.
 * @param {String} msg Mensaje con argumentos.
 * @returns {Void}
 */
export function adminStuff(player, msg) {
    const parts = msg.split(' ');
    const command = parts[0].replace('!', '');
    const commandEvents = {
        "mute": () => {
            mutedCommand(player, parts);
        },
        "unmute": () => {
            unmutedCommand(player, parts);
        },
        "ban": () => {
            banCommand(player, parts);
        },
        "unban": () => {
            unbanCommand(player, parts);
        }
    };
    const action = commandEvents[command];

    if (action) {
        action();
    };
};

/**
 * Lógica que ejecuta cuando se usa el comando `!mute`.
 * @param {Player} player Jugador que activó el comando.
 * @param {string[]} parts Argumentos del comando.
 */
function mutedCommand(player, parts) {
    const formatName = parts.slice(1).join(' ');
    const name = formatName.replace(/[@",]/g, '').trim();

    if (!formatName || !formatName.includes('@') || name == '') {
        player.sendMessage({ translate: "chat.error.sintaxis", with: { rawtext: [{ text: `!mute @"Ha Juegos"` }] } });
        player.playSound("ui.error_blocked");
        return;
    };

    const getPlayer = getSpecificEntities({ type: 'minecraft:player', name: name });

    if (getPlayer && getPlayer.length > 0) {
        const otherPlayer = getPlayer[0];
        if (!(otherPlayer instanceof Player)) return;

        if (player.id == getPlayer[0].id) {
            player.sendMessage({ translate: "chat.error.noyou" });
            player.playSound("ui.error_blocked");
            return;
        };

        otherPlayer.addTag('muted');
        player.sendMessage({ translate: "chat.muted", with: { rawtext: [{ text: `${name}` }] } });
        otherPlayer.playSound("random.screenshot");
        player.playSound("random.screenshot");
    } else {
        player.sendMessage({ translate: "chat.error.nofindplayer", with: { rawtext: [{ text: `${name}` }] } });
        player.playSound("ui.error_blocked");
    };
};

/**
 * Lógica que ejecuta cuando se usa el comando `!unmute`.
 * @param {Player} player Jugador que activó el comando.
 * @param {string[]} parts Argumentos del comando.
 */
function unmutedCommand(player, parts) {
    const formatName = parts.slice(1).join(' ');
    const name = formatName.replace(/[@",]/g, '').trim();

    if (!formatName || !formatName.includes('@') || name == '') {
        player.sendMessage({ translate: "chat.error.sintaxis", with: { rawtext: [{ text: `!unmute @"Ha Juegos"` }] } });
        player.playSound("ui.error_blocked");
        return;
    };

    const getPlayer = getSpecificEntities({ type: 'minecraft:player', name: name });

    if (getPlayer && getPlayer.length > 0) {
        const otherPlayer = getPlayer[0];
        if (!(otherPlayer instanceof Player)) return;

        if (player.id == otherPlayer.id) {
            player.sendMessage({ translate: "chat.error.noyou" });
            player.playSound("ui.error_blocked");
            return;
        };

        if (!otherPlayer.hasTag('muted')) {
            player.sendMessage({ translate: "chat.error.nounmuted", with: { rawtext: [{ text: `${name}` }] } });
            player.playSound("ui.error_blocked");
            return;
        };

        otherPlayer.removeTag('muted');
        player.sendMessage({ translate: "chat.unmuted", with: { rawtext: [{ text: `${name}` }] } });
        otherPlayer.playSound("random.screenshot");
        player.playSound("random.screenshot");
    } else {
        player.sendMessage({ translate: "chat.error.nofindplayer", with: { rawtext: [{ text: `${name}` }] } });
        player.playSound("ui.error_blocked");
    };
};

/**
 * Lógica que ejecuta cuando se usa el comando `!ban`.
 * @param {Player} player Jugador que activó el comando.
 * @param {string[]} parts Argumentos del comando.
 */
function banCommand(player, parts) {
    const formatName = parts.slice(1).join(' ');
    const name = formatName.replace(/[@",]/g, '').trim();

    if (!formatName || !formatName.includes('@') || name == '') {
        player.sendMessage({ translate: "chat.error.sintaxis", with: { rawtext: [{ text: `!ban @"Ha Juegos"` }] } });
        player.playSound("ui.error_blocked");
        return;
    };

    const getPlayer = getSpecificEntities({ type: 'minecraft:player', name: name });

    if (getPlayer && getPlayer.length > 0) {
        const otherPlayer = getPlayer[0];
        if (!(otherPlayer instanceof Player)) return;

        if (player.id == otherPlayer.id) {
            player.sendMessage({ translate: "chat.error.noyou" });
            player.playSound("ui.error_blocked");
            return;
        };

        otherPlayer.addTag('ban');
        player.sendMessage({ translate: "chat.banned", with: { rawtext: [{ text: `${name}` }] } });
        otherPlayer.playSound("random.screenshot");
        player.playSound("random.screenshot");

        saveDataBan(otherPlayer);
        otherPlayer.runCommand(`kick "${otherPlayer.name}" `);
    } else {
        player.sendMessage({ translate: "chat.error.nofindplayer", with: { rawtext: [{ text: `${name}` }] } });
        player.playSound("ui.error_blocked");
    };
};

/**
 * Lógica que ejecuta cuando se usa el comando `!ban`.
 * @param {Player} player Jugador que activó el comando.
 * @param {string[]} parts Argumentos del comando.
 */
function unbanCommand(player, parts) {
    const formatName = parts.slice(1).join(' ');
    const name = formatName.replace(/[@",]/g, '').trim();

    if (!formatName || !formatName.includes('@') || name == '') {
        player.sendMessage({ translate: "chat.error.sintaxis", with: { rawtext: [{ text: `!unban @"Ha Juegos"` }] } });
        player.playSound("ui.error_blocked");
        return;
    };

    const hasData = bannedPlayersData[name];

    if (hasData) {
        const isBanned = hasData.isBanned;
        const isId = hasData.id;

        if (player.id == isId) {
            player.sendMessage({ translate: "chat.error.noyou" });
            player.playSound("ui.error_blocked");
            return;
        };

        if (!isBanned) {
            player.sendMessage({ translate: "chat.error.noban", with: { rawtext: [{ text: `${name}` }] } });
            player.playSound("ui.error_blocked");
            return;
        };

        removeDataBan(name, isId);

        player.sendMessage({ translate: "chat.unban", with: { rawtext: [{ text: `${name}` }] } });
        player.playSound("random.screenshot");
    } else {
        player.sendMessage({ translate: "chat.error.nofindplayer", with: { rawtext: [{ text: `${name}` }] } });
        player.playSound("ui.error_blocked");
    };
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */