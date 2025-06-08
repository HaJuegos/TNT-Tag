/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { DisplaySlotId, ObjectiveSortOrder, Player, system, world } from "@minecraft/server";

import { hideElements, setupCommands, ticksConvertor } from "../globalVariables";
import { gameStarted } from "../functions/gameFn";
import { musicManager } from "../functions/plyFn";
import { showStore } from "../functions/storeMemoFn";

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

system.afterEvents.scriptEventReceive.subscribe(staticEvents => {
    try {
        const { id, sourceEntity: entity } = staticEvents;

        if (!(entity instanceof Player)) return;

        if (id == 'ha:start_individual_music_lobby') {
            musicManager(true, true, entity);
            musicManager(false, true, entity);
        } else if (id == 'ha:start_individual_music') {
            musicManager(true, false, entity);
            musicManager(false, false, entity);
        } else if (id == 'ha:start_music') {
            musicManager(true);
            musicManager();
        } else if (id == 'ha:view_shop_memo') {
            system.runTimeout(() => {
                try {
					showStore(entity);
				} catch {}
            }, ticksConvertor(0.35));
        }
    } catch { }
})

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */