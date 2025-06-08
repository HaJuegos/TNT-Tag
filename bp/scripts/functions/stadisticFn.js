/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from '@minecraft/server';
import * as ui from '@minecraft/server-ui';
/**
 * Variable que almacena de forma temporal las estadisticas de los jugadores.
 * @type {TempStadictic}
 */
let tempStadistic = {};
/**
 * Funcion que se encarga de obtener y dar las estadisticas del jugador.
 * @param {mc.Player} ply Jugador en cuestion.
 * @returns {void}
 */
function showInfoPly(ply) {
    if (!tempStadistic[ply.id]) {
        updateTempData(ply);
    }
    else {
        updateTempData(ply);
    }
    const data = tempStadistic[ply.id];
    const elapsedTime = getElapsedTime(data.startTime);
    const formUI = new ui.ActionFormData().title({ translate: "ui.statsply.title" })
        .body({
        translate: "ui.statsply.body", with: {
            rawtext: [{ text: `\n` },
                { text: `${data.totalPoints}` },
                { text: `${data.totalWin}` },
                { text: `${data.totalDed}` },
                { text: `${elapsedTime}` },
                { text: `${data.totalShoped}` },
                { text: `${data.totalVoted}` },
                { text: `${data.totalTNT}` },
                { translate: `${data.state}` }
            ]
        }
    }).button({ translate: "ui.statsply.end" });
    // @ts-ignore
    formUI.show(ply);
}
/**
 * Funcion que añade monedas a las estadisticas del Jugador.
 * @param {mc.Player} ply Jugador en cuestion.
 * @param {number} value Nuevo valor.
 * @return {void}
 */
function addOrRemoveObj(ply, obj, value) {
    const getObj = mc.world.scoreboard.getObjective(obj);
    getObj?.addScore(ply, value);
    if (!tempStadistic[ply.id]) {
        updateTempData(ply);
    }
    else {
        updateTempData(ply);
    }
}
/**
 * Funcion encargada de asignar o actualizar las estadisticas del jugador.
 * @param {mc.Player} ply Jugador en cuestion.
 * @returns {void}
 */
function updateTempData(ply) {
    const objs = {
        totalPoints: mc.world.scoreboard.getObjective('totalPoints'),
        totalWin: mc.world.scoreboard.getObjective('totalWin'),
        totalDed: mc.world.scoreboard.getObjective('totalDed'),
        totalShoped: mc.world.scoreboard.getObjective('totalShop'),
        totalVoted: mc.world.scoreboard.getObjective('totalVoted'),
        totalTNT: mc.world.scoreboard.getObjective('totalTNT')
    };
    const getScore = (obj, ply) => {
        try {
            return obj?.getScore(ply) ?? 0;
        }
        catch {
            return 0;
        }
    };
    if (!tempStadistic[ply.id]) {
        const states = ['ui.statec1', 'ui.statec2', 'ui.statec3', 'ui.statec4', 'ui.statec5'];
        const selectedState = Math.floor(Math.random() * states.length);
        for (const obj of Object.values(objs)) {
            try {
                obj?.addScore(ply, 0);
            }
            catch { }
        }
        tempStadistic[ply.id] = {
            totalPoints: 0,
            totalWin: 0,
            totalDed: 0,
            totalShoped: 0,
            totalVoted: 0,
            totalTNT: 0,
            startTime: Date.now(),
            state: states[selectedState]
        };
    }
    else {
        const data = tempStadistic[ply.id];
        data.totalPoints = getScore(objs.totalPoints, ply);
        data.totalWin = getScore(objs.totalWin, ply);
        data.totalDed = getScore(objs.totalDed, ply);
        data.totalShoped = getScore(objs.totalShoped, ply);
        data.totalVoted = getScore(objs.totalVoted, ply);
        data.totalTNT = getScore(objs.totalTNT, ply);
    }
}
/**
 * Funcion encargada de formatear el tiempo.
 * @param {number} miliseconds Milisegundos a formatear.
 * @returns {string} El tiempo formateado.
 */
function formatTime(miliseconds) {
    const s = Math.floor(miliseconds / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) {
        return `${d}d ${h % 24}h ${m % 60}m ${s % 60}s`;
    }
    else if (h > 0) {
        return `${h}h ${m % 60}m ${s % 60}s`;
    }
    else if (m > 0) {
        return `${m}m ${s % 60}s`;
    }
    else {
        return `${s}s`;
    }
}
/**
 * Funcion encargada de obtener el tiempo transcurrido desde el inicio.
 * @param {number} startTime Tiempo de inicio.
 * @returns {string} El tiempo transcurrido formateado.
 */
function getElapsedTime(startTime) {
    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    return formatTime(elapsed);
}
export { showInfoPly, addOrRemoveObj, updateTempData };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
