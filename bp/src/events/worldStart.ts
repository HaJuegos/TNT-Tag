/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { DisplaySlotId, EntityComponentTypes, ObjectiveSortOrder, Player, world } from "@minecraft/server";

import { hideElements, setupCommands } from "../globalVariables";
import { gameStarted } from "../functions/gameFn";

world.afterEvents.worldLoad.subscribe(setup => {
    try {
        for (const cmd of setupCommands) {
            world.getDimension('overworld').runCommand(cmd);
        }

        const obj = world.scoreboard.getObjective('winStack');

        if (!obj) return;

        world.scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: obj, sortOrder: ObjectiveSortOrder.Descending });
    } catch { }
});

world.afterEvents.playerSpawn.subscribe(plySpawned => {
    try {
        const { player: ply } = plySpawned;

        for (const cmd of hideElements) {
            ply.runCommand(cmd);
        }
    } catch { }
});

world.afterEvents.buttonPush.subscribe(buttonEvents => {
    try {
        const { block, source: ply } = buttonEvents;

        if (block.typeId == 'minecraft:stone_button' && ply instanceof Player) {
            const coords = { x: Math.floor(block.location.x), y: Math.floor(block.location.y), z: Math.floor(block.location.z) };

            if (coords.x == 2035 && coords.y == 53 && coords.z == -1977) {
                gameStarted(ply);
            }
        }
    } catch { }
});

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */