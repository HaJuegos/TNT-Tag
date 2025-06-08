/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { EntityComponentTypes, EquipmentSlot, GameMode, ItemLockMode, ItemStack, PlatformType, Player, system, world } from "@minecraft/server";

import { getAllEntitiesInAllDime, ticksConvertor } from "../globalVariables";
import { getRandomSpawnMap } from "../mapLocations";
import { updateTempData } from "./stadisticFn";
import { hasItemInInv } from "../loops/extraFn";

interface MusicList {
    song: string;
    titleID: string;
}[];

/**
 * Variable con la lista de musicas del add-on
 * @type {MusicList[]}
 */
const musicList: MusicList[] = [
    { song: "record.pandora_palace", titleID: "m.pandoraPalace" },
    { song: "record.core", titleID: "m.core" },
    // { song: "record.panic", title: "m.panic" },
    { song: "record.eleventh_hour", titleID: "m.eleventhHour" },
    { song: "record.cyber_world", titleID: "m.cyberWorld" },
    { song: "record.smart_race", titleID: "m.smartRace" },
    { song: "record.dinner", titleID: "m.dinner" },
    { song: "record.abstract_map", titleID: "m.abstractMap" },
    { song: "record.android_apartment", titleID: "m.androidApartment" },
    { song: "record.hotline", titleID: "m.hotline" },
    { song: "record.knock_knock", titleID: "m.knockKnock" },
    { song: "record.shape_da_future", titleID: "m.shapeDaFuture" },
    { song: "record.asobu", titleID: "l.asobu" },
    { song: "record.datakrash", titleID: "l.datakrash" },
    { song: "record.judgment", titleID: "m.judgment" },
    { song: "record.backroom_labyrinth", titleID: "l.backroom_labyrinth" },
    { song: "record.trainwreck", titleID: "l.trainwreck" },
    { song: "record.life_is", titleID: "l.life_is" },
    { song: "record.g_bonson", titleID: "l.g_bonson" },
    { song: "record.otherside", titleID: "l.otherside" },
    { song: "record.sunset_city", titleID: "l.sunset_city" }
];

/**
 * Funcion encargada de los eventos al usar la elytra.
 * @param {Player} ply Jugador en cuestion.
 */
function elytraSystem(ply: Player): void {
    const obj = world.scoreboard.getObjective('totalFireworkds');
    const armorInv = ply.getComponent(EntityComponentTypes.Equippable);
    const inv = ply.getComponent(EntityComponentTypes.Inventory)?.container;

    obj?.addScore(ply, 1);

    if ((obj?.getScore(ply) ?? 0) >= 3) {
        system.runTimeout(() => {
            try {
                if (ply) {
                    const item = armorInv?.getEquipment(EquipmentSlot.Chest);

                    if (item && item.typeId == 'minecraft:elytra') {
                        armorInv?.setEquipment(EquipmentSlot.Chest, undefined);
                    } else {
                        if (inv) {
                            for (let i = 0; i < inv.size; i++) {
                                const item = inv.getItem(i);

                                if (item && item.typeId == 'minecraft:elytra') {
                                    inv.setItem(i, undefined);
                                    break;
                                }
                            }
                        }
                    }

                    ply.playSound('random.break');
                    obj?.setScore(ply, 0);
                }
            } catch { }
        }, ticksConvertor(1));
    }
}

/**
 * Funcion encargada de revisar al jugador al spawnear en el mundo.
 * @param {Player} ply Jugador en cuestion
 * @returns {void}
 */
function checkSpawnEvents(ply: Player): void {
    const tags = ply.getTags();
    const isInGame = inGameStarted();
    const plyInfo = ply.clientSystemInfo.platformType;
    const platformIcons: Record<PlatformType, string> = {
        [PlatformType.Mobile]: "",
        [PlatformType.Desktop]: "",
        [PlatformType.Console]: ""
    };

    const resetAndLobbyMusic = () => {
        ply.runCommand(`function system/reset_data`);
        musicManager(false, true, ply);
        updateDataSpawn(ply);
    };

    if (tags.includes('tntPly') || tags.includes('normalPly')) {
        if (isInGame) {
            teleportMap(ply);
            musicManager(false, false, ply);
            updateTempData(ply);
        } else {
            resetAndLobbyMusic();
        }

        return;
    }

    if (tags.includes('spectMode') || inGameStarted()) {
        if (isInGame) {
            teleportSpect(ply);
            musicManager(false, false, ply);
            updateTempData(ply);
        } else {
            resetAndLobbyMusic();
        }

        return;
    }

    if (platformIcons[plyInfo]) {
        ply.nameTag = `${ply.name} ${platformIcons[plyInfo]}`;
    }

    ply.triggerEvent('ha:in_lobby');
    ply.triggerEvent('ha:remove_solid_mode');
    ply.triggerEvent('ha:set_normal_box');
    updateDataSpawn(ply);
    musicManager(false, true, ply);
}

/**
 * Funcion que controla la musica para todos los jugadores o un jugador en especifico.
 * @param {boolean} stop (Opcional) Si es true, se detiene la musica.
 * @param {boolean} isLobby (Opcional) Si es true, inicia la musica del lobby.
 * @param {Player | undefined} target (Opcional) Si tiene un player en especifico, solo se pondra la musica a el, sino, entonces a todos.
 * @returns {void}
 */
function musicManager(stop: boolean = false, isLobby: boolean = false, target?: Player): void {
    const plys = target ? [target] : world.getAllPlayers();

    if (stop) {
        for (const ply of plys) {
            ply.stopMusic();
        }

        return;
    }

    const songs = isLobby ? musicList.filter(music => music.titleID.startsWith('l.')) : musicList.filter(music => !music.titleID.startsWith('l.'));
    const selectedSong = songs[Math.floor(Math.random() * songs.length)];

    for (const ply of plys) {
        let idTitle = selectedSong.titleID;

        ply.stopMusic();
        ply.playMusic(selectedSong.song, { loop: true, volume: 1.15 });

        if (ply.hasTag('tntPly')) {
            idTitle += '.showtnton';
        } else if (ply.hasTag('normalPly')) {
            idTitle += '.showtntoff';
        }

        ply.onScreenDisplay.updateSubtitle(idTitle);
        ply.onScreenDisplay.setTitle("§r");
    }
}

/**
 * Funcion encargada de darle informacion al jugador apenas spawnea y tambien asigna informacion temporal.
 * @param {Player} ply Jugador en cuestion
 * @returns {void}
 */
function updateDataSpawn(ply: Player): void {
    const inv = ply.getComponent(EntityComponentTypes.Inventory)?.container;

    if (inv && !hasItemInInv(inv, 'ha:info_item')) {
        const infoitem = new ItemStack('ha:info_item');

        infoitem.lockMode = ItemLockMode.inventory;
        infoitem.setLore(["When using this item, an interface with various \nstatistics of your current game will be displayed.", "", "Al usar este ítem, saldrá una interfaz con \nvarias estadísticas de tu partida actual."]);
        inv.addItem(infoitem);
    }

    updateTempData(ply);
}

/**
 * Revisa si hay alguna partida activa.
 * @returns {boolean} Devuelve true si es el caso, sino false.
 */
function inGameStarted(): boolean {
    const entity = getAllEntitiesInAllDime({ type: 'ha:game_entity', tags: ['inGame'] });

    if (entity.length > 0) {
        return true;
    }

    return false;
}

/**
 * Funcion que se encarga de teletransportar a los jugadores desconectados a una partida actual si la hay.
 * @param {Player} ply Jugador en cuestion.
 * @returns {void}
 */
function teleportMap(ply: Player): void {
    const game = getAllEntitiesInAllDime({ type: 'ha:game_entity', tags: ['inGame'] });
    const entity = game[0];
    const obj = world.scoreboard.getObjective('mapSelected');
    const map = obj?.getScore(entity) ?? 0;
    const randomSpawn = getRandomSpawnMap(map);

    if (randomSpawn) {
        ply.teleport(randomSpawn);
    }

    ply.sendMessage({ translate: "chat.return_ingame" });
    ply.playSound('mob.guardian.death');
    ply.triggerEvent('ha:remove_glow');
}

/**
 * Funcion encargada de teletransportar a los espectadores a la partida actual.
 * @param {Player} ply Jugador en cuestion.
 * @returns {void}
 */
function teleportSpect(ply: Player): void {
    const players = world.getAllPlayers().filter(p => p.hasTag('normalPly') || p.hasTag('tntPly'));
    const randomPlayer = players[Math.floor(Math.random() * players.length)];

    ply.addTag('spectMode');
    ply.triggerEvent('ha:remove_glow');
    ply.setGameMode(GameMode.spectator);
    ply.teleport(randomPlayer.location);
    ply.sendMessage({ translate: "chat.ingame_return" });
    ply.playSound('mob.guardian.death');
    ply.nameTag = `§r`;

    system.runTimeout(() => {
        try {
            if (ply) {
                ply.setGameMode(GameMode.spectator);
            }
        } catch { }
    }, ticksConvertor(0.25));
}

export { elytraSystem, checkSpawnEvents, musicManager, updateDataSpawn }

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */