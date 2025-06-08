/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player } from "@minecraft/server";

import { CommandBase } from "./types";

/**
 * Clase encargada de registrar, gestionar y recuperar comandos personalizados en el mundo.
 *
 * @remarks
 * - Los comandos se almacenan internamente en un mapa por su nombre en minúsculas.
 * - Los alias se asocian al nombre real del comando para facilitar su recuperación.
 *
 * @example
 * ```typescript
 * const registry = new CmdRegistryClass();
 * 
 * registry.register(myCommand);
 * 
 * const cmd = registry.get('aliasOname');
 * ```
 */
class CmdRegistryClass {
    private cmds = new Map<string, CommandBase>();
    private alias = new Map<string, string>();

    /**
     * Registra los comandos custom al mundo tanto por su nombre por su aias
     * @param {CommandBase} cmd Nombre o alias del comando
     * @returns {void}
     */
    register(cmd: CommandBase): void {
        this.cmds.set(cmd.name.toLowerCase(), cmd);

        if (cmd.alias) {
            cmd.alias.forEach(a => {
                this.alias.set(a.toLowerCase(), cmd.name.toLowerCase());
            });
        }
    }

    /**
     * Obtiene el comando en especifico ya esa por su nombre o alias.
     * @param {string} name Nombre o alias indicado.
     * @returns {CommandBase | undefined} {@link CommandBase} obtenido o sino era undefined si no se encuentra.
     */
    get(name: string): CommandBase | undefined {
        const lowName = name.toLowerCase();
        const cmdName = this.alias.get(lowName) || lowName;

        return this.cmds.get(cmdName);
    }

    /**
     * Se obtiene los datos de los comandos registrados en un array
     * @returns {CommandBase[]} Devuelve los datos de un {@link CommandBase} en forma de {@link Array}.
     */
    getAll(): CommandBase[] {
        return Array.from(this.cmds.values());
    }

    /**
     * Devuelve todos los comandos registrados, en un array.
     * @param {Player} ply Jugador que solicito los comandos
     * @returns {CommandBase[]} Todos los datos de los {@link CommandBase} en un {@link Array}.
     */
    getCmds(ply: Player): CommandBase[] {
        return this.getAll().filter(cmd => {
            return !cmd.permissions || cmd.permissions(ply);
        });
    }

    /**
     * Funcion que obtiene un comando en especifico ya registrado.
     * @param {string} name Nombre del comando.
     * @returns {CommandBase | undefined} Devolvera un {@link CommandBase} en caso de encontrar dicho comando. En caso de que no, sera un error o undefined.
     */
    findCmd(name: string): CommandBase | undefined {
        return this.get(name);
    }
}

export const cmdRegistry = new CmdRegistryClass();

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */