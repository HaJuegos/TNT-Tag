/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { world } from "@minecraft/server";

import { chatRanks } from "./extraFn";
import { cmdManager } from './manager';
import { registerAllCmds } from "./commands/index";

world.afterEvents.worldLoad.subscribe(worldStart => {
    try {
        registerAllCmds();
    } catch { }
});

world.beforeEvents.chatSend.subscribe(async (chatEvent) => {
    try {
        const { sender: ply, message: msg } = chatEvent;

        chatEvent.cancel = true;
        await null;

        if (msg.startsWith('!')) {
            cmdManager.handle(ply, msg);
        } else {
            chatRanks(ply, msg);
        }
    } catch { }
})

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */