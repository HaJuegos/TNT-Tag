/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from '@minecraft/server';
import { getAllEntitiesInAllDime, ticksConvertor } from "../../globalVariables";
import { calculateTNTPlys, endGame } from '../../functions/gameFn';
import { musicManager } from '../../functions/plyFn';
import { addOrRemoveObj } from '../../functions/stadisticFn';
/**
 * Eventos del timer del juego.
 * @type {TimerLoopBase}
 */
const inGameLoop = {
    obj: "timerInGame",
    entities: () => getAllEntitiesInAllDime({ type: 'ha:game_entity', excludeTags: ['wait'], tags: ['inGame'] }),
    onTick(entity, score) {
        if (isGameOver(mc.world.getAllPlayers())) {
            checkEndGame(mc.world.getAllPlayers(), entity);
            return;
        }
        for (const ply of mc.world.getAllPlayers()) {
            if (!ply.isValid)
                continue;
            ply.onScreenDisplay.setActionBar({ translate: "ui.ingametimer", with: { rawtext: [{ text: `${score}` }] } });
            ply.playSound('random.click');
        }
        checkPlys(mc.world.getAllPlayers());
    },
    onComplete(entity) {
        checkEndGame(mc.world.getAllPlayers(), entity);
    }
};
/**
 * Verifica si se cumple la condición para terminar el juego
 * @param {mc.Player[]} plys Lista de jugadores a verificar
 * @returns {boolean} True si el juego debe terminar
 */
function isGameOver(plys) {
    const realPlys = plys.filter(ply => ply.isValid && !ply.hasTag('spectMode'));
    const tntPlys = realPlys.filter(ply => ply.isValid && ply.hasTag('tntPly'));
    const normalPlys = realPlys.filter(ply => ply.isValid && ply.hasTag('normalPly'));
    if (realPlys.length == 0) {
        return true;
    }
    if (tntPlys.length > 1 && normalPlys.length == 0) {
        reasingroles(tntPlys);
        return false;
    }
    if (tntPlys.length == 1 && normalPlys.length == 0) {
        return true;
    }
    if (normalPlys.length == 1 && tntPlys.length == 0) {
        return true;
    }
    return false;
}
/**
 * Funcion encargada de volver a cambiar los roles en caso de que haya mas jugadores con la tnt que jugadores normales.
 * @param {mc.Player[]} tntPlys Lista de jugadores con la tnt.
 * @returns {void}
 */
function reasingroles(tntPlys) {
    const keepTntCount = Math.max(1, Math.min(2, Math.floor(tntPlys.length / 3)));
    const tntPlysWithoutCoin = tntPlys.filter(ply => !ply.hasTag('activatedCoin'));
    const tntPlysWithCoin = tntPlys.filter(ply => ply.hasTag('activatedCoin'));
    const shuffledWithoutCoin = [...tntPlysWithoutCoin].sort(() => Math.random() - 0.5);
    const shuffledWithCoin = [...tntPlysWithCoin].sort(() => Math.random() - 0.5);
    const combinedPlayers = [...shuffledWithoutCoin, ...shuffledWithCoin];
    const specialCase = tntPlys.length == 2 && tntPlysWithCoin.length == 2;
    combinedPlayers.forEach((ply, index) => {
        if (index < keepTntCount) { }
        else {
            ply.runCommand(`function system/remove_tnt`);
        }
    });
    checkPlys(mc.world.getAllPlayers());
}
/**
 * Funcion encargada de los eventos cuando el timer termine.
 * @param {mc.Player[]} plys Lista de jugadores en cuestion.
 * @param {mc.Entity} timerEntity Entidad del timer.
 * @returns {void}
 */
function checkEndGame(plys, timerEntity) {
    const realPlys = plys.filter(ply => ply.isValid && !ply.hasTag('spectMode'));
    const tntPlys = realPlys.filter(ply => ply.isValid && ply.hasTag('tntPly'));
    const normalPlys = realPlys.filter(ply => ply.isValid && ply.hasTag('normalPly'));
    if (realPlys.length == 0) {
        timerEntity.runCommand(`function system/draw_game`);
        timerEntity.removeTag('inGame');
        musicManager(true);
        mc.system.runTimeout(() => {
            try {
                for (const ply of plys) {
                    if (!ply.isValid)
                        continue;
                    ply.setGameMode(mc.GameMode.adventure);
                    ply.removeTag('tntPly');
                    ply.removeTag('normalPly');
                    ply.removeTag('spectMode');
                }
                endGame(timerEntity);
            }
            catch { }
        }, ticksConvertor(4));
        return;
    }
    if (tntPlys.length == 1 && normalPlys.length == 0) {
        tntPlys[0].runCommand(`function system/winning_game`);
        addOrRemoveObj(tntPlys[0], 'totalPoints', Math.floor(Math.random() * 301) + 50);
        timerEntity.removeTag('inGame');
        musicManager(true);
        for (const ply of plys) {
            ply.teleport(tntPlys[0].location);
        }
        mc.system.runTimeout(() => {
            try {
                for (const ply of plys) {
                    if (!ply.isValid)
                        continue;
                    ply.setGameMode(mc.GameMode.adventure);
                    ply.removeTag('tntPly');
                    ply.removeTag('normalPly');
                    ply.removeTag('spectMode');
                }
                endGame(timerEntity);
            }
            catch { }
        }, ticksConvertor(4));
        return;
    }
    if (normalPlys.length == 1 && tntPlys.length == 0) {
        normalPlys[0].runCommand(`function system/winning_game`);
        addOrRemoveObj(normalPlys[0], 'totalPoints', Math.floor(Math.random() * 301) + 50);
        timerEntity.removeTag('inGame');
        musicManager(true);
        for (const ply of plys) {
            ply.teleport(normalPlys[0].location);
        }
        mc.system.runTimeout(() => {
            try {
                for (const ply of plys) {
                    if (!ply.isValid)
                        continue;
                    ply.setGameMode(mc.GameMode.adventure);
                    ply.removeTag('tntPly');
                    ply.removeTag('normalPly');
                    ply.removeTag('spectMode');
                }
                endGame(timerEntity);
            }
            catch { }
        }, ticksConvertor(4));
        return;
    }
    for (const tnt of tntPlys) {
        tnt.runCommand(`function system/explode_tnt`);
    }
    timerEntity.addTag('wait');
    mc.system.runTimeout(() => {
        try {
            findNewTNTPlys(realPlys, timerEntity);
            timerEntity.removeTag('wait');
        }
        catch { }
    }, ticksConvertor(1));
}
/**
 * Funcion encargada de reselecionar jugadores con la TNT cuando el timer llegue a 0.
 * @param {mc.Player[]} plys Lista de todos los Jugadores.
 * @param {mc.Entity} timerEntity Entidad Timer.
 * @returns {void}
 */
function findNewTNTPlys(plys, timerEntity) {
    const normalPlayers = plys.filter(ply => ply.isValid && !ply.hasTag('spectMode') && ply.hasTag('normalPly'));
    const playersWithoutCoin = normalPlayers.filter(ply => ply.isValid && !ply.hasTag('activatedCoin'));
    let eligiblePlayers;
    if (normalPlayers.length == 2 && playersWithoutCoin.length == 0) {
        eligiblePlayers = normalPlayers;
    }
    else if (normalPlayers.length > 0) {
        eligiblePlayers = [...playersWithoutCoin];
        const timerObj = mc.world.scoreboard.getObjective('timerInGame');
        const totalPlayers = normalPlayers.length;
        const tntPlysCount = calculateTNTPlys(totalPlayers);
        const finalTntCount = totalPlayers <= 3 ? 1 : tntPlysCount;
        if (playersWithoutCoin.length < finalTntCount && playersWithoutCoin.length < normalPlayers.length) {
            const playersWithCoin = normalPlayers.filter(ply => ply.hasTag('activatedCoin'));
            const shuffledCoinPlayers = [...playersWithCoin].sort(() => Math.random() - 0.5);
            let i = 0;
            while (eligiblePlayers.length < finalTntCount && i < shuffledCoinPlayers.length) {
                eligiblePlayers.push(shuffledCoinPlayers[i]);
                i++;
            }
        }
        eligiblePlayers = eligiblePlayers.sort(() => Math.random() - 0.5);
        if (eligiblePlayers.length > 0) {
            let totalNormalPlys = 0;
            let totalTntPlys = 0;
            for (let i = 0; i < normalPlayers.length; i++) {
                const player = normalPlayers[i];
                if (i < finalTntCount && eligiblePlayers.includes(player)) {
                    player.runCommand(`function system/give_tnt`);
                    player.onScreenDisplay.updateSubtitle('.showtnton');
                    totalTntPlys++;
                }
                else {
                    totalNormalPlys++;
                }
            }
            changeScoreboard(totalNormalPlys, totalTntPlys);
            timerObj?.setScore(timerEntity, 47);
            return;
        }
    }
    const activePlayers = plys.filter(ply => !ply.hasTag('spectMode') && ply.hasTag('normalPly'));
    const timerObj = mc.world.scoreboard.getObjective('timerInGame');
    const totalPlayers = activePlayers.length;
    if (totalPlayers > 0) {
        const tntPlysCount = calculateTNTPlys(totalPlayers);
        const finalTntCount = totalPlayers <= 3 ? 1 : tntPlysCount;
        const shuffledPlayers = [...activePlayers].sort(() => Math.random() - 0.5);
        let totalNormalPlys = 0;
        let totalTntPlys = 0;
        shuffledPlayers.forEach((ply, index) => {
            if (index < finalTntCount) {
                ply.runCommand(`function system/give_tnt`);
                ply.onScreenDisplay.updateSubtitle('.showtnton');
                totalTntPlys++;
            }
            else {
                totalNormalPlys++;
            }
        });
        changeScoreboard(totalNormalPlys, totalTntPlys);
        timerObj?.setScore(timerEntity, 47);
    }
    else {
        endGame(timerEntity);
    }
}
/**
 * Funcion encargada de cambiar dinamicamente el scoreboard dependiendo al cantidad de jugadores activos.
 * @param {number} totalNormalPlys Total de Jugadores.
 * @param {number} totalTntPlys Total de Jugadores con la TNT.
 * @returns {void}
 */
function changeScoreboard(totalNormalPlys, totalTntPlys) {
    const obj = mc.world.scoreboard.getObjective('totalInGame');
    if (obj) {
        mc.world.scoreboard.setObjectiveAtDisplaySlot(mc.DisplaySlotId.Sidebar, { objective: obj, sortOrder: mc.ObjectiveSortOrder.Descending });
        obj.setScore('score.namePlayerLive', totalNormalPlys);
        obj.setScore('score.namePlayerTnt', totalTntPlys);
    }
}
/**
 *Funcion encargada de revisar los jugadores en juego y ejecutar eventos.
 * @param {mc.Player[]} plys Array de Jugadores.
 * @returns {void}
 */
function checkPlys(plys) {
    const activePlayers = plys.filter(ply => ply.isValid && !ply.hasTag('spectMode'));
    let totalNormalPlys = 0;
    let totalTntPlys = 0;
    activePlayers.forEach(ply => {
        if (ply.hasTag('tntPly')) {
            totalTntPlys++;
        }
        else if (ply.hasTag('normalPly')) {
            totalNormalPlys++;
        }
    });
    changeScoreboard(totalNormalPlys, totalTntPlys);
    if (activePlayers.length < 1) {
        const gameEntities = getAllEntitiesInAllDime({ type: 'ha:game_entity', tags: ['inGame'] });
        if (gameEntities.length > 0) {
            endGame(gameEntities[0]);
        }
        return;
    }
    if (activePlayers.length == 1 && totalNormalPlys == 1 && totalTntPlys == 0) {
        const gameEntities = getAllEntitiesInAllDime({ type: 'ha:game_entity', tags: ['inGame'] });
        if (gameEntities.length > 0) {
            if (isGameOver(plys)) {
                checkEndGame(plys, gameEntities[0]);
            }
        }
        return;
    }
    if (totalTntPlys == 0 && activePlayers.length > 0) {
        newTNTPlayer(activePlayers);
    }
}
/**
 * Funcion encargada de añadir un nuevo jugador con la TNT a la partida en caso de ya no haber mas.
 * @param {mc.Player[]} activePlayers Jugadores en partida para elejir.
 * @returns {void}
 */
function newTNTPlayer(activePlayers) {
    const normalPlayers = activePlayers.filter(ply => ply.hasTag('normalPly') && !ply.hasTag('spectMode'));
    const playersWithoutCoin = normalPlayers.filter(ply => !ply.hasTag('activatedCoin'));
    let eligiblePlayers = playersWithoutCoin;
    if (normalPlayers.length == 2 && playersWithoutCoin.length == 0) {
        eligiblePlayers = normalPlayers;
    }
    else if (playersWithoutCoin.length == 0 && normalPlayers.length > 0) {
        eligiblePlayers = normalPlayers;
    }
    if (eligiblePlayers.length > 0) {
        const randomIndex = Math.floor(Math.random() * eligiblePlayers.length);
        const selectedPlayer = eligiblePlayers[randomIndex];
        selectedPlayer.runCommand(`function system/give_tnt`);
        selectedPlayer.onScreenDisplay.updateSubtitle('.showtnton');
        checkPlys(activePlayers);
    }
}
export { inGameLoop };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
