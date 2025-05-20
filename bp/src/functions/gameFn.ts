/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';

import { getAllEntitiesInAllDime, RGBFloatConvertor, ticksConvertor } from "../globalVariables";
import { getRandomSpawnMap } from '../mapLocations';
import { musicManager } from './plyFn';

/**
 * Funcion de eventos que se ejecutan cuando termina el juego.
 * @param {mc.Entity} timerEntity Timer del juego.
 * @returns {void}
 */
export function endGame(timerEntity: mc.Entity): void {
    const winObj = mc.world.scoreboard.getObjective('winStack');

    if (winObj) {
        mc.world.scoreboard.setObjectiveAtDisplaySlot(mc.DisplaySlotId.Sidebar, { objective: winObj, sortOrder: mc.ObjectiveSortOrder.Descending });
        mc.world.getDimension('overworld').runCommand(`scoreboard players reset * totalInGame`);
    }

    mc.world.getDimension('overworld').runCommand(`spreadplayers 2031 -1967 0.5 4 @a`);
    timerEntity.triggerEvent('ha:despawn');

    musicManager(false, true);

    for (const ply of mc.world.getAllPlayers()) {
        const plyInfo = ply.clientSystemInfo.platformType;
        const platformIcons: Record<mc.PlatformType, string> = {
            [mc.PlatformType.Mobile]: "",
            [mc.PlatformType.Desktop]: "",
            [mc.PlatformType.Console]: ""
        };

        if (platformIcons[plyInfo]) {
            ply.nameTag = `${ply.name} ${platformIcons[plyInfo]}`;
        }
    }
}

/**
 * Funcion que contiene los eventos al iniciar el juego.
 * @param {number} map El Mapa elejido en cuestion.
 * @returns {void}
 */
export function startGame(map: number): void {
    const objMapSelected = mc.world.scoreboard.getObjective('mapSelected');
    const entity = mc.world.getDimension('overworld').spawnEntity<'ha:game_entity'>('ha:game_entity', { x: 2035, y: 53, z: -1977 });

    mc.system.runTimeout(() => {
        const plys = mc.world.getAllPlayers().filter(ply => !ply.hasTag('spectMode'));
        const totalPlys = plys.length;
        let teleported = 0;

        if (totalPlys <= 1) {
            mc.world.sendMessage({ translate: "chat.error_noplayers" });
            mc.world.getDimension('overworld').runCommand(`execute as @a at @s run playsound ui.error.noplayers`);
            entity.triggerEvent('ha:despawn');
            return;
        }

        for (const ply of plys) {
            ply.camera.fade({ fadeTime: { fadeInTime: 1, holdTime: 3.5, fadeOutTime: 0.5 }, fadeColor: RGBFloatConvertor("#000000") });
            ply.playSound('portal.travel');
        }

        mc.system.runTimeout(() => {
            for (const ply of plys) {
                const randomCoords = getRandomSpawnMap(map);

                if (randomCoords) {
                    ply.teleport(randomCoords);
                    teleported++;
                }
            }

            if (teleported == totalPlys) {
                entity.addTag('inGame');
                objMapSelected?.addScore(entity, map);
                setAndCheckPlys(plys, entity);
                musicManager();
            }
        }, ticksConvertor(3));
    }, ticksConvertor(1.5));
}

/**
 * Funcion con los eventos que se ejecutan cuando inicia la partida.
 * @param {Player} sourcePly Jugador que activo el boton.
 * @returns {void}
 */
export function gameStarted(sourcePly: mc.Player): void {
    const plys = mc.world.getAllPlayers();

    if (plys.length <= 1) {
        mc.world.sendMessage({ translate: "chat.error_noplayers" });
        sourcePly.playSound('ui.error.noplayers');
        // return;
    }

    if (checkGame()) {
        sourcePly.sendMessage({ translate: "chat.error.game_started" });
        sourcePly.playSound('ui.powerup.in_cooldown');
        return;
    }

    mc.world.sendMessage({ translate: "chat.gameStarted", with: { rawtext: [{ text: `${plys.length}` }] } });

    for (const ply of plys) {
        const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;
        const item = new mc.ItemStack('ha:calculator');
        let hasItem = false;

        if (inv) {
            for (let i = 0; i < inv.size; i++) {
                const slotItem = inv.getItem(i);

                if (slotItem && slotItem.typeId == item.typeId) {
                    hasItem = true;
                    break;
                }
            }
        }

        if (!hasItem) {
            item.lockMode = mc.ItemLockMode.inventory;
            ply.playSound('random.levelup');

            mc.system.runTimeout(() => {
                inv?.addItem(item);
            }, ticksConvertor(1));
        }
    }

    const entity = mc.world.getDimension('overworld').spawnEntity<'ha:votation_entity'>('ha:votation_entity', { x: 2035, y: 53, z: -1977 });
    const objView = mc.world.scoreboard.getObjective('totalVotesView');
    const objTimer = mc.world.scoreboard.getObjective('timerVotations');

    if (objView) {
        entity.addTag('inVotations');
        mc.world.sendMessage({ translate: "chat.start_voting" });
        objTimer?.setScore(entity, 21);
        mc.world.scoreboard.setObjectiveAtDisplaySlot(mc.DisplaySlotId.Sidebar, { objective: objView, sortOrder: mc.ObjectiveSortOrder.Descending });
    }
}

/**
 * Funcion encargada de calcular el numero balanceado de jugadores con la tnt.
 * @param {number} totalPlys Numero total de jugadores activos.
 * @returns {number} Numero de jugadores que deben tener la tnt.
 */
export function calculateTNTPlys(totalPlys: number): number {
    const min = 1;
    const max = Math.min(5, totalPlys - 1);

    if (max <= min) return min;

    const methods = Math.floor(Math.random() * 3);

    switch (methods) {
        case 0: return Math.max(min, Math.min(max, Math.floor(totalPlys / 3)));
        case 1: {
            if (totalPlys <= 3) return 1;
            if (totalPlys <= 6) return 2;
            if (totalPlys <= 9) return 3;
            if (totalPlys <= 12) return 4;
            return 5;
        };
        case 2: {
            const minTnt = Math.max(min, Math.floor(totalPlys / 4));
            const maxTnt = Math.min(max, Math.floor(totalPlys / 2.5));

            return Math.floor(Math.random() * (maxTnt - minTnt + 1)) + minTnt;
        }
    }

    return Math.max(min, Math.min(max, Math.ceil(totalPlys / 3)));
}

/**
 * Asigna el scoreboard el total de jugadores en partida.
 * @param {number} totalNormalPlys Total de Jugadores normales.
 * @param {number} totalTntPlys Total de Jugadores con la TNT.
 * @returns {void}
 */
function viewAndSetScoreboard(totalNormalPlys: number, totalTntPlys: number, timerEntity: mc.Entity): void {
    const obj = mc.world.scoreboard.getObjective('totalInGame');
    const objTimer = mc.world.scoreboard.getObjective('timerInGame');

    objTimer?.setScore(timerEntity, 47);

    if (obj) {
        mc.world.scoreboard.setObjectiveAtDisplaySlot(mc.DisplaySlotId.Sidebar, { objective: obj, sortOrder: mc.ObjectiveSortOrder.Ascending });
        obj.setScore('score.namePlayerLive', totalNormalPlys);
        obj.setScore('score.namePlayerTnt', totalTntPlys);
    }
}

/**
 * Funcion encargada de revisar los jugadores y asignar los roles respectivos.
 * @param {mc.Player[]} plys Jugadores en cuestion.
 * @returns {void}
 */
function setAndCheckPlys(plys: mc.Player[], timerEntity: mc.Entity): void {
    const activePlayers = plys.filter(ply => !ply.hasTag('spectMode'));
    const totalPlayers = activePlayers.length;
    const tntPlysCount = calculateTNTPlys(totalPlayers);
    const shuffledPlys = [...activePlayers].sort(() => Math.random() * 0.5);

    let totalNormalPlys = 0;
    let totalTntPlys = 0;

    if (totalPlayers <= 1) {
        mc.world.sendMessage({ translate: "chat.error_noplayers" });
        mc.world.getDimension('overworld').runCommand(`execute as @a at @s run playsound ui.error.noplayers`);
        timerEntity.triggerEvent('ha:despawn');
        return;
    }

    shuffledPlys.forEach((ply, index) => {
        if (index < tntPlysCount) {
            ply.runCommand(`function system/give_tnt`);
            totalTntPlys++;
        } else {
            ply.runCommand(`function system/remove_tnt`);
            totalNormalPlys++;
        }
    });

    viewAndSetScoreboard(totalNormalPlys, totalTntPlys, timerEntity);
}

/**
 * Revisa si ya hay una votacion iniciada o un juego ya en progreso antes de empezar una nueva partida.
 * @returns {boolean} Devuelve true, en caso de ser asi. Sino devolvera false.
 */
function checkGame(): boolean {
    const entities = [
        ...getAllEntitiesInAllDime({ type: 'ha:votation_entity', tags: ['inVotations'] }),
        ...getAllEntitiesInAllDime({ type: 'ha:game_entity' })
    ];

    if (entities.length > 0) {
        return true;
    }

    return false;
}

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */