/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { HudElement, HudVisibility, ItemLockMode, ItemStack, Player } from '@minecraft/server';

import { overworld, scoreboard, ticksConvertor } from '../principal/worldStart';
import { gameStarted, musicManager } from './loopFunctions';
import { playersData } from '../principal/loops';
import { isGlowActivated } from './itemFunctions';
import { finalMap, getRandomMap } from './voteFunctions';

/**
 * Ajustes automaticos cuando el jugador entra al mundo.
 * @param {Player} ply Jugador en cuestion.
 * @returns {Void}
 */
export function playerSetup(ply) {
    const obj = scoreboard.getObjective('coinsPlys');
    const inv = ply.getComponent('inventory')?.container;
    const infoItem = new ItemStack('ha:info_player', 1);

    infoItem.lockMode = ItemLockMode.inventory;

    ply.addEffect('saturation', ticksConvertor(99999), { amplifier: 100, showParticles: false });
    ply.onScreenDisplay.setHudVisibility(HudVisibility.Hide, [HudElement.Health, HudElement.Hunger, HudElement.Armor, HudElement.AirBubbles, HudElement.ProgressBar]);
    obj?.addScore(ply, 0);

    if (!gameStarted) {
        let hasItem = false;

        // @ts-ignore
        for (let i = 0; i < inv?.size; i++) {
            let item = inv?.getItem(i);

            if (item?.typeId == 'ha:info_player') {
                hasItem = true;
                break;
            };
        };

        if (!hasItem) {
            inv?.addItem(infoItem);
        };
    };
};

/**
 * Checeo del jugador para verificar si ya ha estado o esta en un juego pendiente.
 * @param {Player} ply Jugador en cuestion.
 * @returns {Void}
 */
export function checkGamePlayer(ply) {
    if (gameStarted) {
        const hasData = playersData[ply.name];

        if (hasData) {
            const tagMap = ply.getTags().find(t => t.includes('map'));

            if (hasData.isPlayer || hasData.isTntPlayer) {
                // @ts-ignore
                ply.removeTag(tagMap);
                ply.tryTeleport(getRandomMap(finalMap), { dimension: overworld });
                ply.addTag(`map${finalMap}`);

                musicManager(false, false, ply);

                ply.sendMessage({ translate: "chat.return_game" });

                if (!isGlowActivated) {
                    ply.triggerEvent("ha:remove_glowing");
                    ply.nameTag = "";
                } else {
                    ply.triggerEvent("ha:set_glowing");
                    ply.nameTag = `${ply.name}`;
                };
            };
        } else {
            ply.runCommand(`function system/now_spectator`);
        };
    } else {
        if (ply.hasTag('spect') || ply.hasTag('tntPlayer') || ply.hasTag('player')) {
            ply.runCommand(`function system/player_return_lobby`);
            musicManager(false, true, ply);
        } else {
            musicManager(false, true, ply);
        };
    };
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */