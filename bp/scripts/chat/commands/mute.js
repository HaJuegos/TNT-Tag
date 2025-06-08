/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Variable con los eventos del comando !mute
 * @type {CommandBase}
 */
const muteCmd = {
    name: "mute",
    descripcion: { translate: "chat.descripcion_cmd.muted" },
    usage: {
        translate: "chat.help.usage", with: {
            rawtext: [
                { text: "!mute" },
                { translate: "chat.help.ply_name_ej" }
            ]
        }
    },
    permissions: (ply) => ply.hasTag('admin') || ply.isOp(),
    execute: (ctxt) => {
        const { ply, args } = ctxt;
        const targetPlyArg = args[0];
        const targetPly = getPly(args[0]);
        if (!targetPlyArg) {
            ply.sendMessage({ translate: "chat.error.missingargs" });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        else if (targetPlyArg && !targetPly) {
            ply.sendMessage({ translate: "chat.error.nofindply", with: { rawtext: [{ text: targetPlyArg }] } });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        else if (targetPlyArg && targetPly && targetPly.hasTag('muted')) {
            if (targetPly && targetPly.id == ply.id) {
                ply.sendMessage({ translate: "chat.error.tpself" });
                ply.playSound("ui.powerup.in_cooldown");
                return;
            }
            ply.sendMessage({ translate: "chat.error.alreadymuted", with: { rawtext: [{ text: targetPlyArg }] } });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        if (targetPly && targetPly.id == ply.id) {
            ply.sendMessage({ translate: "chat.error.tpself" });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        if (targetPly) {
            targetPly.addTag('muted');
            ply.sendMessage({ translate: "chat.success.mutedply", with: { rawtext: [{ text: targetPly.name }] } });
            ply.playSound("random.levelup");
        }
    }
};
/**
 * Funcion que obtiene un jugador en especifico.
 * @param {string} namePly Nombre del Jugador.
 * @returns {mc.Player | undefined} Devuelve un {@link mc.Player} en caso de encontrarlo. Sino sera undefined.
 */
function getPly(namePly) {
    const plys = mc.world.getAllPlayers().filter(ply => ply.name == namePly);
    if (plys.length > 0) {
        return plys[0];
    }
}
export default muteCmd;
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
