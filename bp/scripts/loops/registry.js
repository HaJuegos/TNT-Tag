/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { system, world } from "@minecraft/server";
import { getAllEntitiesInAllDime, ticksConvertor } from "../globalVariables";
import { listOfTimers } from "./types";
// Loop para el tp cuando el juego aun no inicia
system.runInterval(() => {
    try {
        const inGame = getAllEntitiesInAllDime({ type: 'ha:game_entity' });
        if (inGame.length <= 0) {
            for (const ply of world.getAllPlayers().filter(ply => !ply.hasTag('admin'))) {
                if (Math.floor(ply.location.y) <= 43) {
                    ply.teleport({ x: 2031.84, y: 52.36, z: -1967.97 });
                }
            }
        }
        ;
        if (inGame[0].hasTag('inGame')) {
            const glowTime = getAllEntitiesInAllDime({ type: 'ha:glowing_entity', tags: ['glowActivated'] });
            const glowActive = glowTime.length > 0;
            for (const ply of world.getAllPlayers().filter(ply => !ply.hasTag('spectMode'))) {
                const hasCoin = ply.hasTag('activatedCoin');
                const hasTNT = ply.hasTag('tntPly');
                if (glowActive) {
                    ply.nameTag = hasCoin ? `§e§l[COIN ACTIVATED]§r\n${ply.name}` : hasTNT ? `§c§l[TNT]§r\n${ply.name}` : `${ply.name}`;
                }
                else {
                    ply.nameTag = hasCoin ? `§e§l[COIN ACTIVATED]§r` : `§r`;
                }
            }
        }
    }
    catch { }
}, ticksConvertor(0.15));
// Loop principal de los timers.
system.runInterval(() => {
    try {
        for (const timer of listOfTimers) {
            startTimer(timer);
        }
    }
    catch { }
}, ticksConvertor(1));
/**
 * Funcion encargada de mantener un loop de los timers por igual.
 * @param {TimerLoopBase} timer El Timer en cuestion.
 * @returns {Void}
 */
function startTimer(timer) {
    const obj = world.scoreboard.getObjective(timer.obj);
    for (const entity of timer.entities()) {
        obj?.addScore(entity, -1);
        if ((obj?.getScore(entity) ?? 0) <= -1) {
            timer.onComplete(entity);
        }
        else if (timer.onTick) {
            timer.onTick(entity, obj?.getScore(entity) ?? 0);
        }
    }
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
