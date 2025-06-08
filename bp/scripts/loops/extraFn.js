/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from '@minecraft/server';
import { getRandomSpawnMap } from '../mapLocations';
import { ticksConvertor } from '../globalVariables';
/**
 * Funcion encargada de dar efectos en especifico para ciertos mapas
 * @param {mc.Entity} entity Entidad para saber que mapa se elijio.
 * @returns {void}
 */
function checkEffectsMaps(entity) {
    const objMap = mc.world.scoreboard.getObjective('mapSelected');
    const mapSelected = objMap?.getScore(entity) ?? 0;
    for (const ply of mc.world.getAllPlayers().filter(p => !p.hasTag('spectMode'))) {
        const effects = ply.getEffects();
        const hasEffect = (effectId, amplifier = 1) => effects.some(e => e.typeId == effectId && e.amplifier >= amplifier);
        switch (mapSelected) {
            case 1:
                {
                    if (!hasEffect('minecraft:night_vision', 1)) {
                        ply.addEffect('speed', ticksConvertor(9999), { amplifier: 3, showParticles: false });
                    }
                }
                break;
            case 7:
                {
                    if (!hasEffect('minecraft:night_vision', 1)) {
                        ply.addEffect('night_vision', ticksConvertor(9999), { amplifier: 1, showParticles: false });
                    }
                    if (!hasEffect('minecraft:speed', 1)) {
                        ply.addEffect('speed', ticksConvertor(9999), { amplifier: 3, showParticles: false });
                    }
                }
                break;
            case 8:
                {
                    if (!hasEffect('minecraft:night_vision', 1)) {
                        ply.addEffect('night_vision', ticksConvertor(9999), { amplifier: 1, showParticles: false });
                    }
                }
                break;
            case 9:
                {
                    if (!hasEffect('minecraft:speed', 1)) {
                        ply.addEffect('speed', ticksConvertor(9999), { amplifier: 2, showParticles: false });
                    }
                }
                break;
            case 10:
                {
                    if (!hasEffect('minecraft:jump_boost', 1)) {
                        ply.addEffect('jump_boost', ticksConvertor(9999), { amplifier: 2, showParticles: false });
                    }
                }
                break;
        }
    }
}
/**
 * Funcion que revisa si el jugador esta en el vacio cuando hay una partida en juego
 * @param {mc.Player[] | mc.Entity[]} entities Jugador en cuestion.
 * @param {mc.Entity} entity Entidad para obtener el ID del mapa.
 * @returns {void}
 */
function checkInVoid(entities, entity) {
    const objMap = mc.world.scoreboard.getObjective('mapSelected');
    const mapSelected = objMap?.getScore(entity) ?? 0;
    const randomTp = getRandomSpawnMap(mapSelected);
    for (const entity of entities) {
        const coords = { x: Math.floor(entity.location.x), y: Math.floor(entity.location.y), z: Math.floor(entity.location.z) };
        if (randomTp && coords.y <= -73) {
            entity.teleport(randomTp);
        }
    }
}
/**
 * Funcion que revisa si el jugador esta bugeado en bloques para teletransportarlo denuevo.
 * @param {mc.Player} ply Jugador en cuestion.
 * @param {mc.Entity} entity Entidad para obtener el ID del mapa.
 * @returns {void}
 */
function checkInBlock(ply, entity) {
    const objMap = mc.world.scoreboard.getObjective('mapSelected');
    const mapSelected = objMap?.getScore(entity) ?? 0;
    const randomTp = getRandomSpawnMap(mapSelected);
    const coords = ply.location;
    const block = ply.dimension.getBlock(coords);
    if (randomTp && block && block.isSolid && (!block.isLiquid || !block.isAir)) {
        ply.teleport(randomTp);
    }
}
/**
 * Esta funcion verifica si el item ya esta en el inventario del jugador.
 * @param {mc.Container} inv Inventario del jugador.
 * @param {string} itemID Item a identificar.
 * @returns {boolean} Devuelve true si el item ya esta en el inventario, sino false.
 */
function hasItemInInv(inv, itemID) {
    for (let i = 0; i < inv.size; i++) {
        const item = inv.getItem(i);
        if (item && item.typeId == itemID) {
            return true;
        }
    }
    return false;
}
/**
 * Funcion encargada de mantener un loop de los timers por igual.
 * @param {TimerLoopBase} timer El Timer en cuestion.
 * @returns {Void}
 */
function startTimer(timer) {
    const obj = mc.world.scoreboard.getObjective(timer.obj);
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
export { startTimer, hasItemInInv, checkInBlock, checkInVoid, checkEffectsMaps };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
