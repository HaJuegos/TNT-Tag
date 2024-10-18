/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, system, world } from '@minecraft/server';

import { getSpecificEntities, overworld, ticksConvertor } from './worldStart';
import { changeNameTag, isGlowActivated, isOneMap } from '../functions/itemFunctions';
import { checkGameStatus, drawEndGame, endGame, gameStarted, initGameStarted, musicManager, playerInNet, setLoreLoop, setLoreLoopTwo, testMusicManual } from '../functions/loopFunctions';
import { addDataTemp } from '../functions/shopFunctions';

/**
 * Informacion de los jugadores cuando inicia el juego.
 * @type {{ [playerName: string]: { isPlayer: boolean; isTntPlayer: boolean; }; }}
 */
export let playersData = {};

const particleMap = {
    1: "astral:blindness_smoke",
    5: "astral:jump_boost_particle",
    6: "astral:speed_particle",
};

system.runInterval(/** @param {Void} _loopSpeed */ _loopSpeed => {
    try {
        for (const player of world.getAllPlayers()) {
            if (!gameStarted) return;

            if (isOneMap) {
                if (player.hasTag('tntPlayer')) player.addEffect('speed', ticksConvertor(3), { amplifier: 5, showParticles: false });
                if (player.hasTag('player')) player.addEffect('speed', ticksConvertor(3), { amplifier: 3, showParticles: false });
            } else {
                if (player.hasTag('tntPlayer')) player.addEffect('speed', ticksConvertor(3), { amplifier: 1, showParticles: false });
            };
        };
    } catch {};
}, ticksConvertor(0.1));

system.runInterval(/** @param {Void} _loopGlow */ _loopGlow => {
    try {
        if (!isGlowActivated) return;

        getSpecificEntities({ type: 'minecraft:player', excludeTags: ['spect'] }).forEach(player => {
            if (player.hasTag("player")) {
                player.triggerEvent("ha:set_glowing");
            } else if (player.hasTag("tntPlayer")) {
                player.triggerEvent("ha:remove_glowing");
            };
        });
    } catch {};
}, ticksConvertor(0.2));

system.runInterval(/** @param {Void} _loopInNet */ _loopInNet => {
    try {
        getSpecificEntities({ type: 'minecraft:player', tags: ['inNet'] }).forEach(players => {
            const randomMove = (Math.random() * 2) - 1;
            const coords = players.location;

            players.applyKnockback(coords.x, coords.z, randomMove, 0.3);
        });
    } catch {};
}, ticksConvertor(0.9));

system.runInterval(/** @param {Void} _loopCheckDamage */ _loopCheckDamage => {
    try {
        getSpecificEntities({ type: 'minecraft:player' }).forEach(player => {
            if (player.hasTag("player") && !player.hasTag("coinPlayer")) {
                player.triggerEvent("ha:player_damage");
            };

            if (player.hasTag("tntPlayer") && !player.hasTag("coinPlayer")) {
                player.triggerEvent("ha:tntplayer_damage");
            };

            if (player.hasTag("coinPlayer")) {
                player.triggerEvent("ha:coin_damage");
            };

            if (!player.hasTag("player") && !player.hasTag("tntPlayer") && !player.hasTag("coinPlayer")) {
                player.triggerEvent("ha:lobby_damage");
            };
        });
    } catch {};
}, ticksConvertor(0.1));

system.runInterval(/** @param {Void} _loopTPLobby */ _loopTPLobby => {
    try {
        if (gameStarted) return;

        getSpecificEntities({ type: 'minecraft:player', excludeTags: ['admin'] }).forEach(player => {
            const { x, y, z } = player.location;

            if (y <= 40) {
                player.tryTeleport({ x: 2031.94, y: 54.56, z: -1968.17 }, { dimension: overworld });
            };
        });
    } catch {};
}, ticksConvertor(0.1));

system.runInterval(/** @param {Void} _loopCheckDataPlayer */ _loopCheckDataPlayer => {
    try {
        if (gameStarted) {
            for (const player of getSpecificEntities({ type: 'minecraft:player' })) {
                if (!(player instanceof Player)) continue;

                const name = player.name;
                const isPlayer = player.hasTag('player');
                const isTNTPlayer = player.hasTag('tntPlayer');

                playersData[name] = {
                    isPlayer: isPlayer,
                    isTntPlayer: isTNTPlayer
                };
            };
        };
    } catch {};
}, ticksConvertor(0.1));

system.runInterval(/** @param {Void} _loopParticlesEntities */ _loopParticlesEntities => {
    try {
        getSpecificEntities({ type: 'ha:generator_entity' }).forEach(entity => {
            const variant = entity.getComponent('variant');
            const { x, y, z } = entity.location;
            const coords = { x, y: y + 0.5, z };

            const particleType = particleMap[variant?.value];
            // @ts-ignore
            entity.spawnParticle(particleType, coords);
        });
    } catch {};
}, ticksConvertor(1.3));

system.runInterval(/** @param {Void} _loopGameStatus */ _loopGameStatus => {
    try {
        if (!gameStarted) return;

        checkGameStatus();
    } catch {};
}, ticksConvertor(0.85));

system.afterEvents.scriptEventReceive.subscribe(gameEvents => {
    try {
        const { id, sourceEntity: entity, message: msg } = gameEvents;
        const eventList = {
            "ha:game_started": () => {
                initGameStarted();
                changeNameTag(true);
                musicManager();
            },
            "ha:game_ending": () => {
                changeNameTag();
                endGame();
            },
            "ha:game_ending_draw": () => {
                changeNameTag();
                drawEndGame();
            },
            "ha:set_lore": () => {
                if (entity instanceof Player) {
                    setLoreLoop(entity);
                };
            },
            "ha:set_lore_two": () => {
                if (entity instanceof Player) {
                    setLoreLoopTwo(entity);
                };
            },
            'ha:in_net': () => {
                if (entity instanceof Player) {
                    playerInNet(entity);
                };
            },
            'ha:set_data_ded': () => {
                // @ts-ignore
                addDataTemp(entity, 1, false, true);
            },
            'ha:set_data_win': () => {
                // @ts-ignore
                addDataTemp(entity, 1, false, false, true);
            },
            'ha:manual_test_music': () => {
                // @ts-ignore
                testMusicManual(entity, msg);
            }
        };

        const actions = eventList[id];

        if (actions) actions();
    } catch {};
});
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */