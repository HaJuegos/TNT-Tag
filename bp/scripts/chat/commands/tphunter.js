/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Variable con los eventos del comando tphunter
 * @type {CommandBase}
 */
const tpHunterCmd = {
    name: "tphunter",
    alias: ["tph"],
    descripcion: { translate: "chat.descripcion_cmd.tphunter" },
    usage: {
        translate: "chat.help.usage", with: {
            rawtext: [
                { translate: "chat.help.command_ej.tph" },
                { translate: "chat.help.optional" },
                { translate: "chat.help.ply_name_ej" }
            ]
        }
    },
    permissions: (ply) => ply.hasTag('spectMode') || ply.isOp(),
    execute: (ctxt) => {
        const { ply, args } = ctxt;
        const targetPlyArg = args[0];
        const targetPly = getPlys(args[0]);
        if (!targetPlyArg && !targetPly) {
            ply.sendMessage({ translate: "chat.error.nofindtntplys" });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        else if (targetPlyArg && !targetPly) {
            ply.sendMessage({ translate: "chat.error.nofindply", with: { rawtext: [{ text: targetPlyArg }] } });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        else if (targetPlyArg && targetPly && !targetPly.hasTag('tntPly')) {
            if (targetPly && targetPly.id == ply.id) {
                ply.sendMessage({ translate: "chat.error.tpself" });
                ply.playSound("ui.powerup.in_cooldown");
                return;
            }
            ply.sendMessage({ translate: "chat.error.nohastnt", with: { rawtext: [{ text: targetPlyArg }] } });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        if (targetPly && targetPly.id == ply.id) {
            ply.sendMessage({ translate: "chat.error.tpself" });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }
        if (targetPly) {
            const coords = targetPly.location;
            const viewCoords = targetPly.getViewDirection();
            ply.teleport(coords, { facingLocation: viewCoords });
            ply.sendMessage({ translate: "chat.success.telehunter", with: { rawtext: [{ text: targetPly.name }] } });
            ply.playSound("player.random_teleport.start");
        }
    }
};
/**
 * Funcion que obtiene al jugador con un nombre especifico.
 * @param {string | undefined} namePly (Opcional o undefined) Nombre del jugador especifico.
 * @returns {mc.Player | undefined} Devuelve un {@link mc.Player} en caso de encontrarlo por nombre o de forma aleatoria. Sino sera undefined.
 */
function getPlys(namePly) {
    const plys = mc.world.getAllPlayers().filter(ply => ply.name == namePly);
    const plysTNT = mc.world.getAllPlayers().filter(ply => ply.hasTag('tntPly'));
    if (plys.length > 0) {
        return plys[0];
    }
    else if (plysTNT.length > 0) {
        const randomI = Math.floor(Math.random() * plysTNT.length);
        return plysTNT[randomI];
    }
}
export default tpHunterCmd;
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
