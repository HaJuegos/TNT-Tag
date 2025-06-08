/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
import { listOfPowerUps } from "./types";
import { getAllEntitiesInAllDime } from "../globalVariables";
/**
 * Funcion central encargada de los eventos variados al interactuar con la entidad.
 * @param {number} variant Variante en cuestion.
 * @param {mc.Entity} player Entidad fuente. (Jugador)
 * @param {mc.Entity} entity Entidad con la que interactuo. (Generador)
 * @returns {Void}
 */
function handlePowerUpEvents(variant, player, entity) {
    const handle = listOfPowerUps[variant];
    let addCooldown = true;
    const inGame = getAllEntitiesInAllDime({ type: 'ha:game_entity' });
    if (inGame.length <= 0 || !inGame[0].hasTag('inGame')) {
        inCooldownYet(player);
        return;
    }
    if (entity.hasTag('cooldownPower') || player.hasTag('cooldownPower')) {
        inCooldownYet(player);
        return;
    }
    if (player.hasTag('tntPly') && handle.events.onlyTntEvents) {
        const result = handle.events.onlyTntEvents(player);
        if (result == false) {
            return;
        }
        if (handle.events.noCooldown?.tnt) {
            addCooldown = false;
        }
    }
    else if (!player.hasTag('tntPly') && handle.events.onlyPlyEvents) {
        const result = handle.events.onlyPlyEvents(player);
        if (result == false) {
            return;
        }
        if (handle.events.noCooldown?.plys) {
            addCooldown = false;
        }
    }
    else if (handle.events.allEvents) {
        const result = handle.events.allEvents(player);
        if (result == false) {
            return;
        }
        if (handle.events.noCooldown?.all) {
            addCooldown = false;
        }
    }
    if (addCooldown) {
        const players = (() => {
            const entities = [entity];
            if (handle.specificCooldown?.all) {
                return [...mc.world.getAllPlayers().filter(ply => !ply.hasTag('spectMode')), ...entities];
            }
            if (handle.specificCooldown?.allTntPlys) {
                return [...mc.world.getAllPlayers().filter(ply => ply.hasTag('tntPly')), ...entities];
            }
            if (handle.specificCooldown?.allNormalPlys) {
                return [...mc.world.getAllPlayers().filter(ply => ply.hasTag('normalPly')), ...entities];
            }
            return [player, ...entities];
        })();
        startCooldown(players, handle.cooldownPowerUp, handle.cooldownPly);
    }
}
/**
 * Añade cooldown tanto al generador como al jugador que interactuo con el.
 * @param {mc.Entity[] | mc.Player[]} entities Entidades en cuestion.
 * @returns {void}
 */
function startCooldown(entities, cooldownPowerUp = 5, cooldownPly = 10) {
    const cooldownPower = mc.world.scoreboard.getObjective('cooldownPower');
    for (const entity of entities) {
        entity.addTag('cooldownPower');
        if (entity.typeId == 'ha:power_ups') {
            cooldownPower?.setScore(entity, cooldownPowerUp);
            entity.triggerEvent('ha:interact_entity');
        }
        if (entity instanceof mc.Player) {
            cooldownPower?.setScore(entity, cooldownPly);
            entity.playSound('entity.powerups.interact');
        }
    }
}
/**
 * Mensajes que salen cuando aun tienes cooldown con los powerups
 * @param {mc.Player} ply Jugador en cuestion.
 * @returns {Void}
 */
function inCooldownYet(ply) {
    ply.sendMessage({ translate: "chat.cooldown_debuff" });
    ply.playSound('ui.powerup.in_cooldown');
}
export default handlePowerUpEvents;
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
