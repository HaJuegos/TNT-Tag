/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { EquipmentSlot, ItemLockMode, ItemStack, Player, system, world } from "@minecraft/server";

import { getSpecificEntities, overworld, ticksConvertor } from "../principal/worldStart";
import { statisticsPlys } from "./shopFunctions";

/**
 * Objeto que almacena el total de usos de la elytra de todos los jugadores.
 * @type {{ [playerName: string]: number }}
 */
let elytraUses = {};
export let isGlowActivated = false;
export let isOneMap = false;

/**
 * Funcion de diversos eventos cuando el item es usado con la tecla de interaccion.
 * @param {ItemStack | undefined} item Item usado.
 * @param {Player} player Jugador afectado.
 * @returns {Void}
 */
export function onUseEvents(item, player) {
    switch (item?.typeId) {
        case 'ha:calculator': {
            calculatorEvents(player);
        } break;
        case 'ha:super_compass_mapone':
        case 'ha:super_compass': {
            compassEvents(player, item);
        } break;
        case 'ha:coin_item': {
            coinEvents(player, item);
        } break;
        case 'ha:rolling_players_mapone':
        case 'ha:rolling_players': {
            rollEvents(player, item);
        } break;
        case 'ha:wing_item': {
            wingEvents(player, item);
        } break;
        case 'minecraft:firework_rocket': {
            elytraSystem(player);
        } break;
        case 'ha:tnt_item_hand_mapone':
        case 'ha:tnt_item_hand': {
            tntItemEvents(player, item);
        } break;
        case 'ha:companion_cube': {
            companionEvents(player, item);
        } break;
        case 'ha:info_player': {
            statisticsPlys(player);
        } break;
    };
};

/**
 * Eventos que sucederan al usa el item `ha:calculator`.
 * @param {Player} player Jugador afectado
 * @returns {Void}
 */
function calculatorEvents(player) {
    if (player.hasTag("voted")) {
        player.playSound("ui.error_noplayers");
        player.sendMessage({ translate: "chat.yep_voting" });
    } else {
        player.runCommand(`scriptevent ha:voting`);
    };
};

/**
 * Eventos que sucederan al usa el item `ha:super_compass`.
 * @param {Player} ply Jugador que ejecuto el item.
 * @param {ItemStack | undefined} item Item requerido.
 * @returns {Void}
 */
function compassEvents(ply, item) {
    const cooldown = item?.getComponent('cooldown');
    const actualTicks = cooldown?.getCooldownTicksRemaining(ply);

    // @ts-ignore
    if (actualTicks == 0) {
        isGlowActivated = true;

        world.sendMessage({ translate: "chat.compass_activated" });
        world.setTimeOfDay(18000);
        overworld.runCommand(`execute as @a at @s run playsound ui.used_compass`);
        changeNameTag();

        for (let player of world.getAllPlayers()) {
            cooldown?.startCooldown(player);
        };

        const id = system.runTimeout(() => {
            if (isGlowActivated) {
                isGlowActivated = false;

                world.sendMessage({ translate: "chat.compass_deactivated" });
                world.setTimeOfDay(1000);
                overworld.runCommand(`event entity @a[tag=!spect] ha:remove_glowing`);
                overworld.runCommand(`execute as @a at @s run playsound mob.zombie.unfect`);
                changeNameTag(true);
            };

            system.clearRun(id);
        }, ticksConvertor(isOneMap ? 30 : 15));
    } else {
        ply.sendMessage({ translate: "chat.error.item_cooldown" });
        ply.playSound("ui.error_blocked");
    };
};

/**
 * Eventos que sucederan al usar el item `ha:coin_item`.
 * @param {Player} ply Jugador que ejecuta el item.
 * @param {ItemStack | undefined} item Item en cuestion.
 * @returns {Void}
 */
function coinEvents(ply, item) {
    const armorInv = ply.getComponent('equippable');
    const inv = ply.getComponent('inventory')?.container;
    const itemChest = armorInv?.getEquipment(EquipmentSlot.Chest);
    const newItem = new ItemStack("minecraft:netherite_chestplate", 1);
    const elytraItem = new ItemStack('minecraft:elytra', 1);
    const cooldown = item?.getComponent('cooldown');
    const actualSlot = ply.selectedSlotIndex;
    const actualCooldown = cooldown?.getCooldownTicksRemaining(ply);

    newItem.lockMode = ItemLockMode.slot;

    // @ts-ignore
    if (actualCooldown == 0) {
        if (ply.hasTag('tntPlayer')) {
            ply.sendMessage({ translate: "chat.no_coin_activate" });
            ply.playSound("ui.error_blocked");
        } else {
            inv?.setItem(actualSlot, undefined);
            ply.sendMessage({ translate: "chat.activate_coin" });
            ply.playSound("ui.used_coin");
            ply.addTag("coinPlayer");
            ply.triggerEvent("ha:coin_damage");
            cooldown?.startCooldown(ply);
            ply.nameTag = `§e§l[COIN ACTIVATED]§r\n${ply.name}`;

            if (itemChest?.typeId == 'minecraft:elytra') {
                inv?.addItem(elytraItem);
                armorInv?.setEquipment(EquipmentSlot.Chest, newItem);
            } else {
                armorInv?.setEquipment(EquipmentSlot.Chest, newItem);
            };

            const id = system.runTimeout(() => {
                ply.sendMessage({ translate: "chat.removed_coin" });
                ply.playSound("mob.zombie.unfect");
                ply.runCommand(`clear @s netherite_chestplate`);
                ply.removeTag("coinPlayer");
                ply.triggerEvent("ha:player_damage");
                ply.nameTag = isGlowActivated ? `${ply.name}` : "";

                system.clearRun(id);
            }, ticksConvertor(11));
        };
    } else {
        ply.sendMessage({ translate: "chat.error.item_cooldown" });
        ply.playSound("ui.error_blocked");
    };
};

/**
 * Eventos que suceden al usar el item `ha:rolling_players`.
 * @param {Player} ply Player que ejecuta el item.
 * @param {ItemStack | undefined} item Item en cuestión.
 * @returns {Void}
 */
function rollEvents(ply, item) {
    const cooldown = item?.getComponent('cooldown');
    const players = getSpecificEntities({ type: 'minecraft:player', tags: ['player'] });
    const tntPlayers = getSpecificEntities({ type: 'minecraft:player', tags: ['tntPlayer'] });
    const allPlayers = [...players, ...tntPlayers];
    const allCoords = {};
    const actualTicks = cooldown?.getCooldownTicksRemaining(ply);

    // @ts-ignore
    if (actualTicks == 0) {
        for (const player of allPlayers) {
            if (!(player instanceof Player)) continue;

            allCoords[player.name] = {
                coords: player.location,
                viewCoords: player.getViewDirection()
            };
        };

        const randomPlayers = allPlayers.sort(() => Math.random() - 0.5);
        const usedCoords = [];

        for (let i = 0; i < randomPlayers.length; i++) {
            const currentPlayer = randomPlayers[i];
            const nextPlayer = randomPlayers[(i + 1) % randomPlayers.length];

            if (!(currentPlayer instanceof Player) || !(nextPlayer instanceof Player)) continue;

            const targetCoords = allCoords[nextPlayer.name].coords;
            const targetViewCoords = allCoords[nextPlayer.name].viewCoords;

            currentPlayer.tryTeleport(targetCoords, { dimension: overworld, facingLocation: targetViewCoords });
            currentPlayer.playSound("ui.rolling_players");
            cooldown?.startCooldown(currentPlayer);
            usedCoords.push(currentPlayer.name);
        };

        world.sendMessage({ translate: "chat.rolling_players" });
    } else {
        ply.sendMessage({ translate: "chat.error.item_cooldown" });
        ply.playSound("ui.error_blocked");
    };
};

/**
 * Eventos que sucederan al usar el item `ha:wing_item`.
 * @param {Player} ply Jugador que ejecuta el item.
 * @param {ItemStack | undefined} item Item en cuestion.
 * @returns {Void}
 */
function wingEvents(ply, item) {
    const inv = ply.getComponent('inventory')?.container;
    const armorInv = ply.getComponent('equippable');
    const armorSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet];
    const actualSlot = ply.selectedSlotIndex;
    const coords = ply.location;
    const cooldown = item?.getComponent('cooldown');
    let impulseBaseX = 0.1;
    let impulseBaseY = 1.5;
    const actualTicks = cooldown?.getCooldownTicksRemaining(ply);

    // @ts-ignore
    if (actualTicks == 0) {
        armorSlots.forEach(slot => {
            const item = armorInv?.getEquipment(slot);

            if (item?.typeId.includes('netherite')) {
                impulseBaseY = impulseBaseY * 0.25;
                impulseBaseX = impulseBaseX * 0.25;
            };
        });

        ply.applyKnockback(coords.x, coords.z, impulseBaseX, impulseBaseY);
        ply.spawnParticle("minecraft:knockback_roar_particle", { x: coords.x, y: coords.y + 0.5, z: coords.z });
        ply.playSound("mob.enderdragon.flap");
        cooldown?.startCooldown(ply);
        inv?.setItem(actualSlot, undefined);
    } else {
        ply.sendMessage({ translate: "chat.error.item_cooldown" });
        ply.playSound("ui.error_blocked");
    };
};

/**
 * Eventos que sucederan al usar el item `ha:tnt_item_hand`.
 * @param {Player} ply Jugador que ejecuta el item.
 * @param {ItemStack} item Item en cuestion.
 * @returns {Void}
 */
function tntItemEvents(ply, item) {
    const cooldown = item.getComponent('cooldown');
    const actualTicks = cooldown?.getCooldownTicksRemaining(ply);

    // @ts-ignore
    if (actualTicks == 0) {
        for (let player of world.getAllPlayers()) {
            cooldown?.startCooldown(player);
        };
    } else {
        ply.sendMessage({ translate: "chat.error.item_cooldown" });
        ply.playSound("ui.error_blocked");
    };
};

/**
 * Sistema de conteo de uso de las elytras para todos los jugadores.
 * @param {Player} player Jugador en cuestion.
 * @returns {Void}
 */
function elytraSystem(player) {
    const inv = player.getComponent('inventory')?.container;
    const armorInv = player.getComponent('equippable');
    const itemChest = armorInv?.getEquipment(EquipmentSlot.Chest);
    const name = player.name;

    if (!elytraUses[name]) {
        elytraUses[name] = 0;
    };

    if (itemChest?.typeId == 'minecraft:elytra') {
        if (player.isGliding) {
            elytraUses[name]++;
        };

        if (elytraUses[name] >= 3) {
            system.runTimeout(() => {
                player.playSound("random.break");
                armorInv?.setEquipment(EquipmentSlot.Chest, undefined);

                // @ts-ignore
                for (let i = 0; i < inv?.size; i++) {
                    const item = inv?.getItem(i);

                    if (item?.typeId == 'minecraft:elytra') {
                        inv?.setItem(i, undefined);
                    };
                };

                delete elytraUses[name];
            }, ticksConvertor(2));
        };
    };
};

/**
 * Eventos que suceden al usar el item `ha:companion_cube`.
 * @param {Player} ply Jugador que ejecuto el evento.
 * @param {ItemStack | undefined} item Item en cuestion.
 * @returns {Void}
 */
function companionEvents(ply, item) {
    const cooldown = item?.getComponent('cooldown');
    const actualTicks = cooldown?.getCooldownTicksRemaining(ply);

    // @ts-ignore
    if (actualTicks == 0) {
        for (const players of getSpecificEntities({ type: 'minecraft:player' })) {
            if (!(players instanceof Player)) continue;

            cooldown?.startCooldown(players);
        };
    } else {
        ply.sendMessage({ translate: "chat.error.item_cooldown" });
        ply.playSound("ui.error_blocked");
    };
};

/**
 * Altera los nametag de los Jugadores haciendo que se escondan o que sean visibles.
 * @param {Boolean} isHidden `true` para esconderlo y `false` para volverlos visibles.
 * @returns {Void}
 * @example
 *
 * // Al llamarlo sin argumentos, sera por defecto: `false`. Haciendo que todos tengan su nametag correspondiente.
 * changeNameTag();
 *
 * // Al poner true, este escondera los nombres de todos los jugadores.
 * changeNameTag(true);
 */
export function changeNameTag(isHidden = false) {
    world.getAllPlayers().forEach(ply => {
        ply.nameTag = isHidden ? "" : `${ply.name}`;
    });
};

/**
 * Funcion de relleno para indicar que estamos en el mapa #1
 * @returns {Void}
 */
export function isOneMapChance() {
    isOneMap = true;
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */