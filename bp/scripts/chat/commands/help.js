/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { cmdRegistry } from "../registry";
/**
 * Variable con los eventos del comando !help
 * @type {CommandBase}
 */
const helpCmd = {
    name: "help",
    descripcion: { translate: "chat.descripcion_cmd.help" },
    usage: {
        translate: "chat.help.usage", with: {
            rawtext: [
                { text: "!help" },
                { translate: "chat.help.optional" },
                { text: "tph" }
            ]
        }
    },
    execute(ctxt) {
        const { ply, args } = ctxt;
        if (!args[0]) {
            const availCmds = cmdRegistry.getCmds(ply);
            ply.sendMessage({ translate: "chat.help.allcmds" });
            ply.playSound('note.bell');
            availCmds.forEach(cmd => {
                ply.sendMessage("");
                ply.sendMessage(cmd.usage);
            });
        }
        else {
            const cmd = cmdRegistry.findCmd(args[0]);
            if (!cmd) {
                ply.sendMessage({ translate: "chat.error.nofindcmdhelp", with: { rawtext: [{ text: args[0] }] } });
                ply.playSound("ui.powerup.in_cooldown");
                return;
            }
            else if (cmd.permissions && !cmd.permissions(ply)) {
                ply.sendMessage({ translate: "chat.error.nofindcmdhelp", with: { rawtext: [{ text: args[0] }] } });
                ply.playSound("ui.powerup.in_cooldown");
                return;
            }
            ply.sendMessage(cmd.descripcion);
            ply.sendMessage(cmd.usage);
            ply.playSound('note.bell');
        }
    }
};
export default helpCmd;
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
