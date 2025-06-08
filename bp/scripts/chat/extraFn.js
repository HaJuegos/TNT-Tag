/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from '@minecraft/server';
/**
 * FUncion que controla eventos del chat.
 * @param {Player} ply Jugador en cuestion.
 * @param {string} msg Mensaje del jugador en cuestion.
 * @returns {void}
 */
function chatRanks(ply, msg) {
    const info = ply.clientSystemInfo.platformType;
    const platformIcons = {
        [mc.PlatformType.Console]: "",
        [mc.PlatformType.Desktop]: "",
        [mc.PlatformType.Mobile]: ""
    };
    if (ply.hasTag('muted')) {
        ply.sendMessage({ translate: "chat.error.muted" });
        ply.playSound('ui.powerup.in_cooldown');
        return;
    }
    else {
        if (ply.hasTag('tntPly')) {
            mc.world.sendMessage({ text: `[] ${ply.name} §l§7>>§r ${msg}` });
        }
        else if (ply.hasTag('normalPly')) {
            mc.world.sendMessage({ text: `[] ${ply.name} §l§7>>§r ${msg}` });
        }
        else if (ply.hasTag('spectMode')) {
            mc.world.sendMessage({ text: `[] ${ply.name} §l§7>>§r ${msg}` });
        }
        else {
            mc.world.sendMessage({ text: `[${platformIcons[info]}] ${ply.name} §l§7>>§r ${msg}` });
        }
    }
}
export { chatRanks };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
