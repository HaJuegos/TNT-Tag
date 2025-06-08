/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { cmdRegistry } from "../registry";

import helpCmd from "./help";
import muteCmd from "./mute";
import tpHunterCmd from "./tphunter";
import tpPlayerCmd from "./tpplayer";
import unmuteCmd from "./unmute";

/**
 * Funcion que registra todos los comandos custom al mundo.
 * @returns {void}
 */
export function registerAllCmds(): void {
    cmdRegistry.register(helpCmd);
    cmdRegistry.register(tpHunterCmd);
    cmdRegistry.register(tpPlayerCmd);
    cmdRegistry.register(muteCmd);
    cmdRegistry.register(unmuteCmd);
}

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */