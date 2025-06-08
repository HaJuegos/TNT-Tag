/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';

import { cmdRegistry } from './registry';
import { CmdContext } from './types';

/**
 * Esta clase controla el manejo de eventos de los comandos custom y el jugador.
 * 
 * @remarks
 * - El prefix por defecto es y sera siempre "!".
 * - Los argumentos pueden tener espacios y seran reajustados.
 * - Tiene manejo de errores a remarcar.
 * 
 * @example
 * const manager = new CmdManager();
 * 
 * manager.handle(player, '!tph');
 */
class CmdManager {
    private prefix = "!";

    handle(ply: mc.Player, msg: string): void {
        const withoutPrefix = msg.slice(this.prefix.length).trim();
        const spaceIndex = withoutPrefix.indexOf(' ');
        const cmdName = spaceIndex == -1 ? withoutPrefix.toLowerCase() : withoutPrefix.slice(0, spaceIndex).toLowerCase();
        const argsString = spaceIndex == -1 ? '' : withoutPrefix.slice(spaceIndex + 1);
        const args = argsString ? this.parseArgs(argsString) : [];
        const cmd = cmdRegistry.get(cmdName);

        if (!cmd) {
            ply.sendMessage({ translate: "chat.error.nocmd" });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }

        if (cmd.permissions && !cmd.permissions(ply)) {
            ply.sendMessage({ translate: "chat.error.noadmin" });
            ply.playSound("ui.powerup.in_cooldown");
            return;
        }

        const ctxt: CmdContext = { ply, args, fullMsg: msg, cmdName };

        try {
            cmd.execute(ctxt);
        } catch (e) {
            if (e instanceof Error) {
                console.warn(`Error: Algo raro paso con el comando: ${cmdName} usado por ${ply.name}. Razon:`, e, e.stack);
            }
        }
    }

    /**
     * Funcion que quita los "", " " para adaptar el argumento de los nombres.
     * @private
     * @param {string} argsString Argumento del nombre.
     * @returns {string[]} Devuelve el nombre mas arreglado.
     */
    private parseArgs(argsString: string): string[] {
        const args: string[] = [];
        let currentArg = '';
        let inQuotes = false;

        for (let i = 0; i < argsString.length; i++) {
            const char = argsString[i];

            if (char == '"') {
                inQuotes = !inQuotes;
            } else if (char == ' ' && !inQuotes) {
                if (currentArg.length > 0) {
                    args.push(this.cleanArg(currentArg));
                    currentArg = '';
                }
            } else {
                currentArg += char;
            }
        }

        if (currentArg.length > 0) {
            args.push(this.cleanArg(currentArg));
        }

        return args;
    }

    /**
     * Funcion que limpia los argumentos de los nombres, quitando los espacios, comillas y el @.
     * @private
     * @param {string} arg Nombre del argumento.
     * @returns {string} Devuelve el nombre mas limpio.
     */
    private cleanArg(arg: string): string {
        let cleaned = arg.trim();

        if (cleaned.startsWith('@')) {
            cleaned = cleaned.slice(1);
        }

        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
            cleaned = cleaned.slice(1, -1);
        }

        return cleaned;
    }
}

export const cmdManager = new CmdManager();

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */