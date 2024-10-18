/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { ItemStack, Player, system } from "@minecraft/server";

import { getSpecificEntities, overworld, scoreboard, ticksConvertor } from "../principal/worldStart";
import { changeNameTag } from "./itemFunctions";

/**
 * Objectos que contienen tanto el title de la cancion cono el id de la cancion.
 * @type {Array.<{ song: string, title: string }>}
 */
const listOfMusics = [
    { song: "record.pandora_palace", title: "m.pandoraPalace" },
    { song: "record.core", title: "m.core" },
    // { song: "record.panic", title: "m.panic" },
    { song: "record.eleventh_hour", title: "m.eleventhHour" },
    { song: "record.cyber_world", title: "m.cyberWorld" },
    { song: "record.smart_race", title: "m.smartRace" },
    { song: "record.dinner", title: "m.dinner" },
    { song: "record.abstract_map", title: "m.abstractMap" },
    { song: "record.android_apartment", title: "m.androidApartment" },
    { song: "record.hotline", title: "m.hotline" },
    { song: "record.knock_knock", title: "m.knockKnock" },
    { song: "record.shape_da_future", title: "m.shapeDaFuture" },
    { song: "record.asobu", title: "l.asobu" },
    { song: "record.datakrash", title: "l.datakrash" },
    { song: "record.judgment", title: "m.judgment" }
];

export let gameStarted = false;
let isFiveMap = false;

/**
 * Logica de partidas iniciadas
 * @returns {Void}
*/
export function checkGameStatus() {
    const allPlayers = getSpecificEntities({ type: 'minecraft:player' });
    const totalPlayers = allPlayers.filter(p => p.hasTag('player')).length || 0;
    const totalTNTPlayers = allPlayers.filter(p => p.hasTag('tntPlayer')).length || 0;
    const objTotal = scoreboard.getObjective('totalInGame');
    const objPlys = scoreboard.getObjective('players');
    const objTNTPls = scoreboard.getObjective('tntPlayers');

    getSpecificEntities({ type: 'ha:sensor', tags: ['ingame'] }).forEach(entity => {
        objPlys?.setScore(entity, totalPlayers);
        objTNTPls?.setScore(entity, totalTNTPlayers);

        let totalScore = objTotal?.getScore(entity) || 0;
        let totalScorePlayers = objPlys?.getScore(entity) || 0;
        let totalScoreTNTPlayers = objTNTPls?.getScore(entity) || 0;

        if (totalScore <= -1) {
            entity.runCommand(`function system/exploding_tnt`);
        };

        if (totalScorePlayers == 0 && totalScoreTNTPlayers == 0) {
            overworld.runCommand(`scriptevent ha:game_ending_draw`);
        } else if (totalScorePlayers == 1 && totalScoreTNTPlayers == 0) {
            overworld.runCommand(`scriptevent ha:game_ending`);
        } else if (totalScorePlayers > 1 && totalScoreTNTPlayers == 0) {
            overworld.runCommand(`scriptevent ha:reselect_tntplayers`);
        } else if (totalScorePlayers == 0 && totalScoreTNTPlayers == 1) {
            changeTNTPlayer();
        };
    });

    overworld.runCommand(`scoreboard players set "score.namePlayerLive" totalAllPlayers ${totalPlayers}`);
    overworld.runCommand(`scoreboard players set "score.namePlayerTnt" totalAllPlayers ${totalTNTPlayers}`);
};

/**
 * Una funcion de relleno solo para poner un true xd
 * @returns {Void}
 */
export function initGameStarted() {
    gameStarted = true;
};

/**
 * Funcion para terminar una partida.
 * @returns {Void}
 */
export function endGame() {
    musicManager(true);

    getSpecificEntities({ type: 'minecraft:player', tags: ['player'] }).forEach(player => {
        player.runCommand(`function system/winning_game`);
        player.runCommand(`tp @a[tag=spect] @r[tag=player]`);

        system.runTimeout(() => {
            gameStarted = false;
            isFiveMap = false;
            overworld.runCommand(`function system/return_lobby`);
            musicManager(false, true);
            changeNameTag();
        }, ticksConvertor(6));
    });
};

/**
 * Funcion para terminar una partida empatada.
 * @returns {Void}
 */
export function drawEndGame() {
    musicManager(true);

    overworld.runCommand(`function system/drawparty`);

    system.runTimeout(() => {
        gameStarted = false;
        isFiveMap = false;
        overworld.runCommand(`function system/return_lobby_draw`);
        musicManager(false, true);
        changeNameTag();
    }, ticksConvertor(6));
};

/**
 * Función que controla todo lo relacionado con la música con uno o varios jugadores.
 * @param {boolean} stopMusic Opcional, detiene la música para uno o varios jugadores.
 * @param {boolean} isLobbyMusic Opcional, determina si la música es solo la del lobby o no.
 * @param {Player | undefined} targetPlayer Opcional, determina si es solo para un jugador o no.
 * @returns {Void}
 */
export function musicManager(stopMusic = false, isLobbyMusic = false, targetPlayer = undefined) {
    const players = targetPlayer ? [targetPlayer] : getSpecificEntities({ type: 'minecraft:player' });
    const lobbySongs = listOfMusics.filter(music => music.title.startsWith('l.'));
    const regularSongs = listOfMusics.filter(music => !music.title.startsWith('l.'));

    const randomI = Math.floor(Math.random() * regularSongs.length);
    const randomL = Math.floor(Math.random() * lobbySongs.length);
    const randomMusic = regularSongs[randomI];
    const randomLobby = lobbySongs[randomL];

    if (stopMusic) {
        for (const ply of players) {
            if (!(ply instanceof Player)) continue;

            ply.stopMusic();
        };
        return;
    };

    if (isLobbyMusic) {
        for (const ply of players) {
            if (!(ply instanceof Player)) continue;

            ply.stopMusic();
            ply.playMusic(randomLobby.song, { loop: true });
            ply.runCommand(`title @s subtitle ${randomLobby.title}`);
            ply.runCommand(`title @s title §r`);
        };
        return;
    };

    for (const ply of players) {
        if (!(ply instanceof Player)) continue;

        ply.stopMusic();
        ply.playMusic(isFiveMap ? listOfMusics[14].song : randomMusic.song, { loop: true });
        ply.runCommand(`title @s subtitle ${isFiveMap ? listOfMusics[14].title : randomMusic.title}`);
        ply.runCommand(`title @s title §r`);
    };
    return;
};

/**
 * Funcion de prueba para testear los titulos y las musicas del add-on
 * @param {Player} ply Jugador en cuestion
 * @param {String} arg ID de la musica
 * @returns {Void}
 */
export function testMusicManual(ply, arg) {
    const argInt = parseInt(arg);

    if (argInt == 0) {
        musicManager(true, false, ply);
        musicManager(false, true, ply);
    } else if (argInt == 1) {
        musicManager(true, false, ply);
        musicManager(false, false, ply);
    };
};

/**
 * Se inserta lore a un item de forma indefinida.
 * @param {Player} player Jugador que sera afectado
 * @returns {Void}
 */
export function setLoreLoop(player) {
    const inv = player.getComponent('inventory')?.container;
    const item = new ItemStack('ha:coin_item', 1);

    // @ts-ignore
    for (let i = 0; i < inv?.size; i++) {
        const item = inv?.getItem(i);

        if (item?.typeId == 'ha:coin_item' && item.getLore().length == 0) {
            item.setLore(["§bEste item te protejera de los jugadores con TNT", "", "§bThis item will protect you from TNT players"]);
            inv?.setItem(i, item);
        };
    };
};

/**
 * Se inserta lore a un item de forma indefinida.
 * @param {Player} player Jugador que sera afectado
 * @returns {Void}
 */
export function setLoreLoopTwo(player) {
    const inv = player.getComponent('inventory')?.container;
    const item = new ItemStack('ha:wing_item', 1);

    // @ts-ignore
    for (let i = 0; i < inv?.size; i++) {
        const item = inv?.getItem(i);

        if (item?.typeId == 'ha:wing_item' && item.getLore().length == 0) {
            item.setLore(["§bEste item te lanzara por lo mas alto", "", "§bThis item will launch you over the top"]);
            inv?.setItem(i, item);
        };
    };
};

/**
 * Logica que pasara cuando estas atrapado en una red.
 * @param {Player} player Jugador en cuestion.
 * @returns {Void}
 */
export function playerInNet(player) {
    player.inputPermissions.movementEnabled = false;
    player.camera.setCamera("minecraft:third_person");
    player.addTag("inNet");

    system.runTimeout(() => {
        player.inputPermissions.movementEnabled = true;
        player.camera.clear();
        player.removeTag("inNet");
        player.triggerEvent("ha:remove_in_net");
        player.spawnParticle("minecraft:knockback_roar_particle", { x: player.location.x, y: player.location.y + 0.5, z: player.location.z });
    }, ticksConvertor(6));
};

/**
 * Una funcion que añade un secreto al mapa 5, una cancion extra.
 * @returns {Void}
 */
export function isFiveMapChance() {
    const randomChance = Math.floor(Math.random() * 101);

    if (randomChance <= 25) {
        isFiveMap = true;
    };
};

/**
 * Funcion que cambia a los jugadores de TNT que quedaron debido a que fueron asesinados antes
 * @returns {Void}
 */
function changeTNTPlayer() {
    const tntPlayers = getSpecificEntities({ type: 'minecraft:player', tags: ['tntPlayer'] });

    for (const ply of tntPlayers) {
        if (!(ply instanceof Player)) continue;

        ply.removeTag("tntPlayer");
        ply.addTag("player");
    };
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */