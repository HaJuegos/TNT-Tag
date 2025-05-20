/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, world, PlatformType } from '@minecraft/server';

world.beforeEvents.chatSend.subscribe(async (chatSensor) => {
    try {
        const { message: msg, sender: ply } = chatSensor;

        chatSensor.cancel = true;

        await null;
        chatRanks(ply, msg);
    } catch { }
});

/**
 * FUncion que controla eventos del chat.
 * @param {Player} ply Jugador en cuestion.
 * @param {string} msg Mensaje del jugador en cuestion.
 * @returns {void}
 */
function chatRanks(ply: Player, msg: string) {
    const info = ply.clientSystemInfo.platformType;
    const platformIcons: Record<PlatformType, string> = {
        [PlatformType.Console]: "",
        [PlatformType.Desktop]: "",
        [PlatformType.Mobile]: ""
    };

    if (ply.hasTag('tntPly')) {
        world.sendMessage({ text: `[] ${ply.name} §l§7>>§r ${msg}` });
    } else if (ply.hasTag('normalPly')) {
        world.sendMessage({ text: `[] ${ply.name} §l§7>>§r ${msg}` });
    } else if (ply.hasTag('spectMode')) {
        world.sendMessage({ text: `[] ${ply.name} §l§7>>§r ${msg}` });
    } else {
        world.sendMessage({ text: `[${platformIcons[info]}] ${ply.name} §l§7>>§r ${msg}` });
    }
}

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */