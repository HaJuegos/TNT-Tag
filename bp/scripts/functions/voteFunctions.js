/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { DisplaySlotId, EquipmentSlot, ItemLockMode, ItemStack, ObjectiveSortOrder, Player, system, TimeOfDay, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { getSpecificEntities, overworld, RGBFloatConvertor, scoreboard, ticksConvertor } from "../principal/worldStart";
import { spawnZonesMap1, spawnZonesMap10, spawnZonesMap2, spawnZonesMap3, spawnZonesMap4, spawnZonesMap5, spawnZonesMap6, spawnZonesMap7, spawnZonesMap8, spawnZonesMap9 } from "../principal/variables";
import { changeNameTag, isGlowActivated, isOneMap, isOneMapChance } from "./itemFunctions";
import { initGameStarted, isFiveMapChance } from "./loopFunctions";
import { addDataTemp, checkItemsShop } from "./shopFunctions";

export let inVotations = false;
export let startVotations = false;
export let finalMap = 0;

let randomVoted = 0;
let map1Voted = 0;
let map2Voted = 0;
let map3Voted = 0;
let map4Voted = 0;
let map5Voted = 0;
let map6Voted = 0;
let map7Voted = 0;
let map8Voted = 0;
let map9Voted = 0;
let map10Voted = 0;

const votationsUI = new ActionFormData().title({ translate: "ui.votation_time" }).body({ translate: "ui.votation_choose" })
    .button({ translate: "ui.button_random" }, "textures/ui/custom_icon/random")
    .button({ translate: "ui.button_vote1" }, "textures/ui/custom_icon/map1")
    .button({ translate: "ui.button_vote2" }, "textures/ui/custom_icon/map2")
    .button({ translate: "ui.button_vote3" }, "textures/ui/custom_icon/map3")
    .button({ translate: "ui.button_vote4" }, "textures/ui/custom_icon/map4")
    .button({ translate: "ui.button_vote5" }, "textures/ui/custom_icon/map5")
    .button({ translate: "ui.button_vote6" }, "textures/ui/custom_icon/map6")
    .button({ translate: "ui.button_vote7" }, "textures/ui/custom_icon/map7")
    .button({ translate: "ui.button_vote8" }, "textures/ui/custom_icon/map8")
    .button({ translate: "ui.button_vote9" }, "textures/ui/custom_icon/map9")
    .button({ translate: "ui.button_vote10" }, "textures/ui/custom_icon/map10");

const warningUI = new ActionFormData().title({ translate: "ui.warning_vote_1" }).body({ translate: "ui.warning_vote_text" })
    .button({ translate: "ui.warning.buttonyes" })
    .button({ translate: "ui.warning.buttonno" });

const warningUIRandom = new ActionFormData().title({ translate: "ui.warning_vote_1" }).body({ translate: "ui.warning_voterandom_text" })
    .button({ translate: "ui.warning.buttonyes" })
    .button({ translate: "ui.warning.buttonno" });

/**
 * Opciones para votar
 * @type {{ votes: () => number, message: String, score: number}[]}
 */
const votationOptions = [
    { votes: () => randomVoted++, message: "chat.random", score: 0 },
    { votes: () => map1Voted++, message: "chat.voted1", score: 1 },
    { votes: () => map2Voted++, message: "chat.voted2", score: 2 },
    { votes: () => map3Voted++, message: "chat.voted3", score: 3 },
    { votes: () => map4Voted++, message: "chat.voted4", score: 4 },
    { votes: () => map5Voted++, message: "chat.voted5", score: 5 },
    { votes: () => map6Voted++, message: "chat.voted6", score: 6 },
    { votes: () => map7Voted++, message: "chat.voted7", score: 7 },
    { votes: () => map8Voted++, message: "chat.voted8", score: 8 },
    { votes: () => map9Voted++, message: "chat.voted9", score: 9 },
    { votes: () => map10Voted++, message: "chat.voted10", score: 10 }
];

/**
 * Logica que muestra el panel de votaciones en una partida.
 * @param {Player} ply Jugador en Cuestion que recibe la pantalla.
 * @returns {Void}
 */
export function showUIVotations(ply) {
    const objCoins = scoreboard.getObjective('coinsPlys');

    // @ts-ignore
    votationsUI.show(ply).then(r => {
        if (r.canceled || ply.hasTag("voted")) return;

        if (r.selection == 0 || r.selection == 1) {
            warningUISet(ply, r.selection);
        } else {
            // @ts-ignore
            const { votes, message, score } = votationOptions[r.selection];
            const obj = scoreboard.getObjective('totalVotes');

            votes();

            obj?.addScore(`score.${score == 0 ? 'random' : `map${score}`}`, 1);

            ply.sendMessage({ translate: message });
            ply.addTag("voted");
            ply.playSound("random.levelup");

            objCoins?.addScore(ply, 5);
            addDataTemp(ply, 1, false, false, false, false, true);
        };
    });
};

/**
 * Muestra un aviso antes de votar en un mapa.
 * @param {Player} ply Jugador en cuestion.
 * @param {Number} selection Eleccion en cuestion.
 * @returns {Void}
 */
function warningUISet(ply, selection) {
    const objCoins = scoreboard.getObjective('coinsPlys');

    if (selection == 0) {
        // @ts-ignore
        warningUIRandom.show(ply).then(r => {
            if (r.canceled || r.selection == 1) {
                showUIVotations(ply);
            };

            if (r.selection == 0) {
                const { votes, message, score } = votationOptions[0];
                const obj = scoreboard.getObjective('totalVotes');

                votes();

                obj?.addScore(`score.${score == 0 ? 'random' : `map${score}`}`, 1);

                ply.sendMessage({ translate: message });
                ply.addTag("voted");
                ply.playSound("random.levelup");

                objCoins?.addScore(ply, 5);
                addDataTemp(ply, 1, false, false, false, false, true);
            };
        });
    } else if (selection == 1) {
        // @ts-ignore
        warningUI.show(ply).then(r => {
            if (r.canceled || r.selection == 1) {
                showUIVotations(ply);
            };

            if (r.selection == 0) {
                const { votes, message, score } = votationOptions[1];
                const obj = scoreboard.getObjective('totalVotes');

                votes();

                obj?.addScore(`score.${score == 0 ? 'random' : `map${score}`}`, 1);

                ply.sendMessage({ translate: message });
                ply.addTag("voted");
                ply.playSound("random.levelup");

                objCoins?.addScore(ply, 5);
                addDataTemp(ply, 1, false, false, false, false, true);
            };
        });
    };
};

/**
 * Logica que agrega el item "calculadora" a los jugadores cuando hay votaciones activas.
 * @returns {Void}
 */
export function loopCalculator() {
    for (let entity of getSpecificEntities({ type: 'minecraft:player' })) {
        if (!(entity instanceof Player)) continue;

        const inv = entity.getComponent('inventory')?.container;
        const calculatorItem = new ItemStack('ha:calculator', 1);
        let hasItem = false;

        calculatorItem.lockMode = ItemLockMode.inventory;

        // @ts-ignore
        for (let i = 0; i < inv?.size; i++) {
            const item = inv?.getItem(i);

            if (item?.typeId == 'ha:calculator') {
                hasItem = true;
                break;
            };
        };

        if (!hasItem) {
            inv?.addItem(calculatorItem);
            entity.sendMessage({ translate: "chat.start_voting" });
        };
    };
};

/**
 * Logica que inicia el sistema de votacion en una partida
 * @returns {Void}
 */
export function initVotations() {
    const obj = scoreboard.getObjective('totalVotes');
    startVotations = true;
    inVotations = true;

    overworld.spawnEntity('ha:votation_timer', { x: 2031, y: 52, z: -1969 });
    // @ts-ignore
    scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: obj, sortOrder: ObjectiveSortOrder.Descending });
};

/**
 * Logica de las votaciones para que terminen cuando una partida vaya a empezar.
 * @returns {Void}
 */
export function endVotations() {
    const obj = scoreboard.getObjective('winStack');
    // @ts-ignore
    scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: obj, sortOrder: ObjectiveSortOrder.Descending });

    startVotations = false;
    inVotations = false;
    initGameStarted();

    getSpecificEntities({ type: 'minecraft:player' }).forEach(player => {
        player.removeTag('voted');
    });

    gameStarted();
};

/**
 * Toda la logica del juego cuando inicia una ronda
 * @async
 * @returns {Promise<Void>}
 */
export async function gameStarted() {
    const data = await checkVotations();
    const msg = data.finalMsg;
    const map = data.finalMap;

    world.sendMessage(msg);

    system.runTimeout(() => {
        const players = getSpecificEntities({ type: 'minecraft:player' });

        players.forEach(player => {
            if (!(player instanceof Player)) return;

            player.camera.fade({ fadeTime: { fadeInTime: 1, holdTime: 3.5, fadeOutTime: 0.5 }, fadeColor: RGBFloatConvertor("#000000") });
            player.runCommand(`clear @s`);
            player.playSound("portal.travel");
        });

        system.runTimeout(() => {
            players.forEach(player => {
                if (!(player instanceof Player)) return;

                player.tryTeleport(getRandomMap(map), { dimension: overworld });
                player.addTag(`map${map}`);

                if (map == 1) {
                    isOneMapChance();
                } else if (map == 5) {
                    isFiveMapChance();
                } else if (map == 7) {
                    player.addEffect('night_vision', ticksConvertor(99999), { amplifier: 100, showParticles: false });
                } else if (map == 10) {
                    player.addEffect('fire_resistance', ticksConvertor(99999), { amplifier: 100, showParticles: false });
                };
            });

            finalMap = map;

            setAndGetPlayers();
            checkItemsShop();

            for (const entity of getSpecificEntities({ type: 'ha:sensor' })) {
                const obj = scoreboard.getObjective('totalInGame');
                const objPlys = scoreboard.getObjective('totalAllPlayers');

                entity.addTag("ingame");
                obj?.setScore(entity, 55);
                // @ts-ignore
                scoreboard.setObjectiveAtDisplaySlot(DisplaySlotId.Sidebar, { objective: objPlys, sortOrder: ObjectiveSortOrder.Descending });
                entity.runCommand(`scriptevent ha:game_started`);
            };

            randomVoted = 0;
            map1Voted = 0;
            map2Voted = 0;
            map3Voted = 0;
            map4Voted = 0;
            map5Voted = 0;
            map6Voted = 0;
            map7Voted = 0;
            map8Voted = 0;
            map9Voted = 0;
            map10Voted = 0;
        }, ticksConvertor(3));
    }, ticksConvertor(5));
};

/**
 * Logica que se activa antes de iniciar una partida para ver si hay jugadores para empezar.
 * @returns {Void}
 */
export function beforeStartParty() {
    const players = getSpecificEntities({ type: 'minecraft:player' });

    if (players.length > 1) {
        world.sendMessage({ translate: "chat.gameStarted", with: { rawtext: [{ text: `${players.length}` }] } });
        overworld.runCommand(`execute as @a at @s run playsound random.levelup`);
        overworld.runCommand(`scriptevent ha:starting_votation`);
    } else {
        world.sendMessage({ translate: "chat.error_noplayers" });
        overworld.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
    };
};

/**
 * Busqueda inesperada cuando un jugador se sale en medio de la partida o tambien por si hace falta un jugador cuando va a iniciar la partida.
 * @returns {Void}
 */
export function reselectSpectificPlayers() {
    const normalPlayers = getSpecificEntities({ type: 'minecraft:player', tags: ['player'] });
    const obj = scoreboard.getObjective('coinsPlys');
    let numImpostors;

    normalPlayers.forEach(p => {
        obj?.addScore(p, 17);
    });

    if (normalPlayers.length == 2) {
        numImpostors = 1;
    } else {
        numImpostors = Math.ceil(Math.sqrt(normalPlayers.length)) - 1;
    };

    const shuffledPlayers = normalPlayers.sort(() => Math.random() - 0.5);

    shuffledPlayers.forEach((player, index) => {
        if (index < numImpostors) {
            player.triggerEvent("ha:give_tnt");
        };
    });
};

/**
 * Todo lo que se le asigna al jugador que le toca la TNT.
 * @param {Player} player Jugador en cuestion.
 * @returns {Void}
 */
export function setTNTStuff(player) {
    const item1 = new ItemStack('ha:tnt_helmet', 1);
    const item2 = isOneMap ? new ItemStack('ha:tnt_item_hand_mapone', 1) : new ItemStack('ha:tnt_item_hand', 1);
    const item3 = isOneMap ? new ItemStack('ha:super_compass_mapone', 1) : new ItemStack('ha:super_compass', 1);
    const item4 = isOneMap ? new ItemStack('ha:rolling_players_mapone', 1) : new ItemStack('ha:rolling_players', 1);
    const inv = player.getComponent('inventory')?.container;
    const armorInv = player.getComponent('equippable');

    item1.lockMode = ItemLockMode.slot;
    item2.lockMode = ItemLockMode.inventory;
    item3.lockMode = ItemLockMode.inventory;
    item4.lockMode = ItemLockMode.inventory;

    armorInv?.setEquipment(EquipmentSlot.Head, item1);

    let hasitem2 = false;
    let hasitem3 = false;
    let hasitem4 = false;

    // @ts-ignore
    for (let i = 0; i < inv?.size; i++) {
        const item = inv?.getItem(i);

        if (item?.typeId == item2.typeId) {
            hasitem2 = true;
        };

        if (item?.typeId == item3.typeId) {
            hasitem3 = true;
        };

        if (item?.typeId == item4.typeId) {
            hasitem4 = true;
        };
    };

    if (!hasitem2) {
        inv?.addItem(item2);
    };

    if (!hasitem3) {
        inv?.addItem(item3);
    };

    if (!hasitem4) {
        inv?.addItem(item4);
    };
};

/**
 * Logica para terminar una partida en definitva.
 * @returns {void}
 */
export function startEndGame() {
    changeNameTag();

    if (isGlowActivated) {
        world.sendMessage({ translate: "chat.compass_deactivated" });

        getSpecificEntities({ type: 'minecraft:player', excludeTags: ['spect'] }).forEach(ply => {
            if (!(ply instanceof Player)) return;

            ply.triggerEvent("ha:remove_glowing");
            ply.playSound("mob.zombie.unfect");
        });

        world.setTimeOfDay(TimeOfDay.Day);
    };
};

/**
 * Revisa las votaciones dadas por los usuarios y determina el mapa ganador.
 * @returns {{finalMap: number, finalMsg: import("@minecraft/server").RawText}}
 */
function checkVotations() {
    let msg;
    let map = 0;
    const votes = [map1Voted, map2Voted, map3Voted, map4Voted, map5Voted, map6Voted, map7Voted, map8Voted, map9Voted, map10Voted];
    const maxVotes = Math.max(...votes);
    const totalMaxVotes = votes.reduce((/**@type {Number[]}*/ acc, vote, index) => {
        if (vote == maxVotes) {
            acc.push(index + 1);
        };
        return acc;
    }, []);

    if (randomVoted > maxVotes) {
        map = Math.floor(Math.random() * 10) + 1;
        // @ts-ignore
        msg = { translate: "chat.random_map_win", with: { rawtext: [{ text: `${map}` }] } };
    } else if (totalMaxVotes.length == 1) {
        map = totalMaxVotes[0];
        msg = { translate: "chat.mapWinnning", with: { rawtext: [{ text: `${map}` }, { text: `${maxVotes}` }] } };
    } else {
        map = totalMaxVotes[Math.floor(Math.random() * totalMaxVotes.length)];
        msg = { translate: "chat.map_equals", with: { rawtext: [{ text: `${map}` }] } };
    };

    return { finalMap: map, finalMsg: msg };
};

/**
 * Se obtienen los puntos de spawn del mapa elejido para luego devolverlo.
 * @param {Number} map Mapa elejido.
 * @returns {import("@minecraft/server").Vector3} Coordenadas de spawn del mapa elejido.
 */
export function getRandomMap(map) {
    let spawnZones = {};

    switch (map) {
        case 1: { spawnZones = spawnZonesMap1; } break;
        case 2: { spawnZones = spawnZonesMap2; } break;
        case 3: { spawnZones = spawnZonesMap3; } break;
        case 4: { spawnZones = spawnZonesMap4; } break;
        case 5: { spawnZones = spawnZonesMap5; } break;
        case 6: { spawnZones = spawnZonesMap6; } break;
        case 7: { spawnZones = spawnZonesMap7; } break;
        case 8: { spawnZones = spawnZonesMap8; } break;
        case 9: { spawnZones = spawnZonesMap9; } break;
        case 10: { spawnZones = spawnZonesMap10; } break;
    };

    let randomI = Math.floor(Math.random() * spawnZones.length);
    return spawnZones[randomI];
};

/**
 * Se obtiene y establece los roles de TNT y Jugadores a todos los jugadores al iniciar una partida.
 * @returns {Void}
 */
function setAndGetPlayers() {
    const basePlayers = getSpecificEntities({ type: 'minecraft:player', excludeTags: ['admin'] });
    const numPlayers = basePlayers.length;
    let numImpostors;

    if (numPlayers == 2) {
        numImpostors = 1;
    } else {
        numImpostors = Math.ceil(Math.sqrt(numPlayers)) - 1;
    };

    const shuffledPlayers = basePlayers.sort(() => Math.random() - 0.5);

    shuffledPlayers.forEach((player, index) => {
        if (index < numImpostors) {
            player.addTag("tntPlayer");
            player.triggerEvent("ha:give_tnt");
        } else {
            player.addTag("player");
            player.triggerEvent("ha:receive_tnt");
        };
    });
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */