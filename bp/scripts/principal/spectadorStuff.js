/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { world } from "@minecraft/server";

import { commandsSpect } from "../functions/spectFunctions";

world.beforeEvents.chatSend.subscribe(async spectCommands => {
    try {
        const { sender: player, message } = spectCommands;

        if (player.hasTag('spect') && message.startsWith('!')) {
            spectCommands.cancel = true;

            await null;
            commandsSpect(player, message);
        };
    } catch {};
});

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */