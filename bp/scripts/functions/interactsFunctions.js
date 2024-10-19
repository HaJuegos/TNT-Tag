/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Entity, ItemLockMode, ItemStack, Player, system, world } from "@minecraft/server";

import { getSpecificEntities, overworld, scoreboard, ticksConvertor } from "../principal/worldStart";
import { isGlowActivated } from "./itemFunctions";

/**
 * Verifica y ejecuta eventos dependiendo la variante del mob que da el boost.
 * @param {Player} player Jugador que interactua.
 * @param {Entity} mob Mob a revisar.
 * @returns {Void}
 */
export function checkVariantMob(player, mob) {
    const obj = scoreboard.getObjective('coinsPlys');

    if (player.hasTag('cooldownBuff')) {
        player.sendMessage({ translate: "chat.cooldown_debuff" });
        player.playSound("ui.error_blocked");
        return;
    };

    const variant = mob.getComponent('variant')?.value;
    const variantActions = {
        1: blidnessBuff,
        2: bowAndArrowBuff,
        3: coinBuff,
        4: invisibilityBuff,
        5: jumpBoostBuff,
        6: speedBuff,
        7: wingBuff,
        8: resetTimerTNT,
        9: elytraBuff,
        10: slownessBuff,
        11: netgunBuff,
        12: cubeBuff
    };
    const action = variantActions[variant];

    if (action) {
        action(player, mob);
        obj?.addScore(player, 5);
    };
};

/**
 * Agrega un cooldown de boost tanto al jugador que interactuo con el mob, como el mob mismo.
 * @param {Player} player Jugador en cuestion.
 * @param {Entity} mob Mob en cuestion.
 * @returns {Void}
 */
function setCooldownBoost(player, mob) {
    mob.triggerEvent("ha:interact_despawn");
    player.addTag("cooldownBuff");
    player.playSound("ui.used_boost");

    system.runTimeout(() => {
        player.removeTag("cooldownBuff");
    }, ticksConvertor(12));
};

/**
 * Agrega un cooldown de boost a todos los jugadores con la tnt, tambien el mob mismo recibe cooldown.
 * @param {Entity} mob Mob en cuestion.
 * @returns {Void}
 */
function setCooldownBoostAllPlys(mob) {
    const players = getSpecificEntities({ type: 'minecraft:player', tags: ['tntPlayer'] });

    mob.triggerEvent("ha:interact_despawn");

    players.forEach(p => {
        p.addTag("cooldownBuff");
        // @ts-ignore
        p.playSound("ui.used_boost");

        system.runTimeout(() => {
            p.removeTag("cooldownBuff");
        }, ticksConvertor(12));
    });
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, ceguera.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function blidnessBuff(player, mob) {
    const msg = player.hasTag("player") ? { translate: "chat.debuff_blidness" } : player.hasTag("tntPlayer") ? { translate: "chat.debuff_blindness_tnt" } : "";
    const filters = player.hasTag("player") ? { type: 'minecraft:player', tags: ['tntPlayer'] } : player.hasTag("tntPlayer") ? { type: 'minecraft:player', tags: ['player'] } : {};

    world.sendMessage(msg);

    getSpecificEntities(filters).forEach(ply => {
        ply.addEffect('blindness', ticksConvertor(5), { amplifier: 0, showParticles: true });
    });

    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Arco y Flecha.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function cubeBuff(player, mob) {
    const inv = player.getComponent('inventory')?.container;
    const item1 = new ItemStack('ha:companion_cube', 1);

    item1.lockMode = ItemLockMode.inventory;

    inv?.addItem(item1);
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Arco y Flecha.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function bowAndArrowBuff(player, mob) {
    const inv = player.getComponent('inventory')?.container;
    const item1 = new ItemStack('minecraft:bow', 1);
    const item2 = new ItemStack('minecraft:arrow', 3);

    item1.lockMode = ItemLockMode.inventory;
    item2.lockMode = ItemLockMode.inventory;

    inv?.addItem(item1);
    inv?.addItem(item2);
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Moneda.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function coinBuff(player, mob) {
    const inv = player.getComponent('inventory')?.container;
    const item1 = new ItemStack('ha:coin_item', 1);

    item1.lockMode = ItemLockMode.inventory;
    item1.setLore(["§bEste item te protege de la TNT.", "", "§bThis item protects you from TNT."]);

    if (player.hasTag("tntPlayer")) {
        player.sendMessage({ translate: "chat.no_coin_activate" });
        player.playSound("ui.error_blocked");
        return;
    };

    inv?.addItem(item1);
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Invisibilidad.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function invisibilityBuff(player, mob) {
    if (isGlowActivated) {
        player.sendMessage({ translate: "chat.cooldown_debuff" });
        player.playSound("ui.error_blocked");
        return;
    };

    if (player.hasTag('tntPlayer')) {
        player.sendMessage({ translate: "chat.no_coin_activate" });
        player.playSound("ui.error_blocked");
        return;
    };

    player.addEffect("invisibility", ticksConvertor(10), { amplifier: 0, showParticles: true });
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Impulso de Salto.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function jumpBoostBuff(player, mob) {
    player.addEffect("jump_boost", ticksConvertor(10), { amplifier: 3, showParticles: true });
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Velocidad.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function speedBuff(player, mob) {
    player.addEffect("speed", ticksConvertor(10), { amplifier: 3, showParticles: true });
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Item Ala.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function wingBuff(player, mob) {
    const inv = player.getComponent('inventory')?.container;
    const item = new ItemStack('ha:wing_item', 1);

    item.lockMode = ItemLockMode.inventory;
    item.setLore(["§bEste item te lanzara por los aires.", "", "§bThis item will launch you into the air."]);

    inv?.addItem(item);
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Reiniciar tiempo.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function resetTimerTNT(player, mob) {
    if (player.hasTag("player")) {
        player.sendMessage({ translate: "chat.notnt_item" });
        player.playSound("ui.error_blocked");
        return;
    };

    world.sendMessage({ translate: "chat.timerreset" });
    overworld.runCommand(`playsound ui.used_clock @a`);
    overworld.runCommand(`scoreboard players add @e[type=ha:sensor] totalInGame 25`);

    setCooldownBoostAllPlys(mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Item Elytra.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function elytraBuff(player, mob) {
    const inv = player.getComponent('inventory')?.container;
    const item = new ItemStack("minecraft:elytra", 1);
    const item2 = new ItemStack("minecraft:firework_rocket", 3);

    item.lockMode = ItemLockMode.inventory;
    item2.lockMode = ItemLockMode.inventory;

    inv?.addItem(item);
    inv?.addItem(item2);
    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Lentitud Buff.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function slownessBuff(player, mob) {
    const msg = player.hasTag("player") ? { translate: "chat.debuff_slowness" } : player.hasTag("tntPlayer") ? { translate: "chat.debuff_slowness_tnt" } : "";
    const filters = player.hasTag("player") ? { type: 'minecraft:player', tags: ['tntPlayer'] } : player.hasTag("tntPlayer") ? { type: 'minecraft:player', tags: ['player'] } : {};

    getSpecificEntities(filters).forEach(ply => {
        ply.addEffect("slowness", ticksConvertor(3), { amplifier: 9, showParticles: true });
    });

    setCooldownBoost(player, mob);
};

/**
 * Todos los eventos que pasaran cuando se interactue con el buff, Item NetGun.
 * @param {Player} player Jugador que activa el evento
 * @param {Entity} mob Mob en cuestion
 * @returns {Void}
 */
function netgunBuff(player, mob) {
    const inv = player.getComponent('inventory')?.container;
    const item = new ItemStack('ha:net_gun', 3);

    item.lockMode = ItemLockMode.inventory;

    inv?.addItem(item);
    setCooldownBoost(player, mob);
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */