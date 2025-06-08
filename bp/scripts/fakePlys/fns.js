/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from '@minecraft/server';
import * as test from '@minecraft/server-gametest';
import { ticksConvertor } from '../globalVariables';
const timers = new Map();
const botBehaviorStates = new Map();
function checkactions(bot) {
    initializeBotBehavior(bot.id);
    const dataTimer = timers.get(bot.id);
    if (bot.isInWater) {
        stopAll(bot);
        mc.system.runTimeout(() => {
            try {
                waterActions(bot);
                agresiveJump(bot);
            }
            catch { }
        }, ticksConvertor(0.5));
    }
    else {
        if (dataTimer) {
            mc.system.clearRun(dataTimer);
        }
        if (bot.hasTag('inNet'))
            return;
        if (bot.hasTag("normalPly")) {
            normalActions(bot);
            return;
        }
        else if (bot.hasTag("tntPly")) {
            tntActions(bot);
            return;
        }
        else {
            stopAll(bot);
            if (!bot.hasTag('spectMode')) {
                idleActions(bot);
            }
        }
    }
}
function initializeBotBehavior(botId) {
    if (!botBehaviorStates.has(botId)) {
        botBehaviorStates.set(botId, {
            lastDecisionTime: Date.now(),
            currentBehavior: 'idle',
            behaviorDuration: Math.random() * 3000 + 1000,
            personalityTraits: {
                jumpiness: Math.random(),
                curiosity: Math.random()
            }
        });
    }
}
function tntActions(bot) {
    const entities = bot.dimension.getEntities({ location: bot.location, maxDistance: 300, excludeTags: ['spectMode'] });
    const normalPlayers = entities.filter(e => e.id != bot.id && e instanceof mc.Player && e.hasTag("normalPly"));
    if (normalPlayers.length > 0) {
        const target = normalPlayers[Math.floor(Math.random() * normalPlayers.length)];
        const distance = getDistance(bot.location, target.location);
        bot.isSprinting = true;
        bot.lookAtEntity(target, test.LookDuration.Continuous);
        if (distance < 6) {
            bot.stopGliding();
            bot.navigateToEntity(target, 1);
            bot.navigateToEntity(target, 1);
            if (Math.random() < 0.4) {
                bot.jump();
            }
            if (Math.random() < 0.25) {
                bot.isSneaking = true;
            }
            else {
                bot.isSneaking = false;
            }
        }
        else {
            bot.isSneaking = false;
            if (Math.random() < 0.35) {
                useElytra(bot);
            }
            else {
                bot.stopGliding();
            }
            bot.lookAtEntity(target, test.LookDuration.Continuous);
            bot.moveRelative(0, 1, 1);
            agresiveJump(bot);
        }
    }
    else {
        idleActions(bot);
    }
}
function normalActions(bot) {
    const entities = bot.dimension.getEntities({ location: bot.location, maxDistance: 8, excludeTags: ['spectMode'] });
    const tntPlayers = entities.filter(e => e.id != bot.id && e instanceof mc.Player && e.hasTag("tntPly"));
    if (tntPlayers.length > 0) {
        let closest = tntPlayers[0];
        let minDist = getDistance(bot.location, closest.location);
        for (const ply of tntPlayers) {
            const dist = getDistance(bot.location, ply.location);
            if (dist < minDist) {
                closest = ply;
                minDist = dist;
            }
        }
        let dx = bot.location.x - closest.location.x;
        let dz = bot.location.z - closest.location.z;
        const length = Math.sqrt(dx * dx + dz * dz) || 1;
        const randomAngle = (Math.random() - 0.5) * Math.PI / 2;
        const cos = Math.cos(randomAngle);
        const sin = Math.sin(randomAngle);
        const ndx = dx * cos - dz * sin;
        const ndz = dx * sin + dz * cos;
        const leftRight = ndx / length;
        const backwardForward = ndz / length;
        if (Math.random() < 0.5) {
            const entities = bot.dimension.getEntities({ location: bot.location, maxDistance: 8, excludeTags: ['spectMode'] });
            const near = entities.find(e => e.id != bot.id && (e instanceof mc.Player || e instanceof mc.Entity));
            if (near) {
                bot.lookAtEntity(near, test.LookDuration.Continuous);
            }
        }
        else {
            bot.lookAtLocation({ x: bot.location.x + ndx, y: bot.location.y, z: bot.location.z + ndz }, test.LookDuration.Continuous);
        }
        if (Math.random() < 0.5) {
            bot.jump();
        }
        if (Math.random() < 0.15) {
            useElytra(bot);
        }
        else {
            bot.stopGliding();
        }
        bot.isSprinting = true;
        bot.moveRelative(leftRight, backwardForward, 1);
    }
    else {
        idleActions(bot);
    }
}
function idleActions(bot) {
    const botState = botBehaviorStates.get(bot.id);
    const currentTime = Date.now();
    if (currentTime - botState.lastDecisionTime > botState.behaviorDuration) {
        botState.lastDecisionTime = currentTime;
        botState.behaviorDuration = Math.random() * 4000 + 1000;
        const behaviors = ['explore', 'look', 'rest', 'wander', 'spin', 'patrol'];
        botState.currentBehavior = behaviors[Math.floor(Math.random() * behaviors.length)];
    }
    switch (botState.currentBehavior) {
        case 'explore':
            {
                if (Math.random() < 0.8) {
                    const leftRight = (Math.random() - 0.5) * 2;
                    const backwardForward = (Math.random() - 0.5) * 2;
                    if (Math.random() < 0.7) {
                        const angle = Math.atan2(leftRight, backwardForward) * (180 / Math.PI);
                        bot.rotateBody(angle * 0.5);
                    }
                    bot.moveRelative(leftRight, backwardForward);
                    bot.isSprinting = true;
                }
            }
            break;
        case 'look':
            {
                if (Math.random() < botState.personalityTraits.curiosity) {
                    const entities = bot.dimension.getEntities({ location: bot.location, maxDistance: 8, excludeTags: ['spectMode'] });
                    const near = entities.find(e => e.id != bot.id && (e instanceof mc.Player || e instanceof mc.Entity));
                    if (near) {
                        bot.lookAtEntity(near, test.LookDuration.Continuous);
                    }
                    else {
                        const randomAngle = (Math.random() - 0.5) * 180;
                        bot.rotateBody(randomAngle);
                    }
                }
            }
            break;
        case 'rest':
            {
                if (Math.random() < 0.7) {
                    bot.isSneaking = true;
                    if (Math.random() < 0.4) {
                        bot.moveRelative((Math.random() - 0.5) * 1, (Math.random() - 0.5) * 1);
                    }
                }
                else {
                    bot.isSneaking = false;
                }
            }
            break;
        case 'wander':
            {
                bot.isSneaking = false;
                if (Math.random() < 0.8) {
                    const direction = Math.random() * 2 * Math.PI;
                    const leftRight = Math.sin(direction);
                    const backwardForward = Math.cos(direction);
                    const lookAngle = direction * (180 / Math.PI);
                    bot.setBodyRotation(lookAngle);
                    bot.moveRelative(leftRight, backwardForward);
                    bot.isSprinting = true;
                }
            }
            break;
        case 'spin':
            {
                if (Math.random() < botState.personalityTraits.curiosity) {
                    const spinDirection = Math.random() > 0.5 ? 1 : -1;
                    bot.rotateBody(45 * spinDirection);
                    if (Math.random() < 0.3) {
                        bot.moveRelative(0, 0.5);
                    }
                }
            }
            break;
        case 'patrol':
            {
                if (Math.random() < 0.9) {
                    const mainDirections = [
                        { lr: 0, bf: 1 },
                        { lr: 0, bf: -1 },
                        { lr: 1, bf: 0 },
                        { lr: -1, bf: 0 }
                    ];
                    const dir = mainDirections[Math.floor(Math.random() * mainDirections.length)];
                    const leftRight = dir.lr + (Math.random() - 0.5) * 0.3;
                    const backwardForward = dir.bf + (Math.random() - 0.5) * 0.3;
                    if (Math.random() < 0.8) {
                        const angle = Math.atan2(leftRight, backwardForward) * (180 / Math.PI);
                        bot.setBodyRotation(angle);
                    }
                    bot.moveRelative(leftRight, backwardForward);
                    bot.isSprinting = Math.random() < 0.4;
                }
            }
            break;
    }
    if (Math.random() < botState.personalityTraits.jumpiness * 0.4) {
        bot.jump();
    }
}
function waterActions(bot) {
    const coords = { x: Math.floor(bot.location.x), y: Math.floor(bot.location.y), z: Math.floor(bot.location.z) };
    const directions = [
        { x: 1, z: 0 },
        { x: -1, z: 0 },
        { x: 0, z: 1 },
        { x: 0, z: -1 },
    ];
    const dir = directions[Math.floor(Math.random() * directions.length)];
    const target = { x: coords.x + dir.x, y: coords.y, z: coords.z + dir.z };
    bot.isSprinting = true;
    bot.lookAtLocation(target, test.LookDuration.Continuous);
    bot.moveToLocation(target);
}
function agresiveJump(bot) {
    const getTimer = timers.get(bot.id);
    const timer = mc.system.runInterval(() => {
        try {
            bot.jump();
        }
        catch { }
    }, ticksConvertor(0.1));
    timers.set(bot.id, timer);
}
function getDistance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
function startAttack(bot, tag) {
    const entities = bot.dimension.getEntities({ location: bot.location, maxDistance: 5 });
    const targets = entities.filter(e => e.id != bot.id && e instanceof mc.Player && e.hasTag(tag));
    let closest;
    let minDist = Infinity;
    for (const target of targets) {
        const dist = getDistance(bot.location, target.location);
        if (dist < minDist) {
            minDist = dist;
            closest = target;
        }
    }
    if (closest) {
        bot.lookAtEntity(closest, test.LookDuration.Continuous);
        bot.attackEntity(closest);
    }
    if (Math.random() < 3.35) {
        const items = [
            { item: "ha:coin", condition: () => bot.hasTag("normalPly") },
            { item: "ha:companion_cube" },
            { item: "ha:super_compass", condition: () => bot.hasTag("tntPly") },
            { item: "ha:net_gun" },
            { item: "ha:rolling_players", condition: () => bot.hasTag("tntPly") },
            { item: "ha:player_projectile", condition: () => bot.hasTag("hasPly") },
            { item: "ha:tnt_projectile", condition: () => bot.hasTag("tntPly") },
            { item: "ha:wing" },
            { item: "minecraft:wind_charge" },
            { item: "minecraft:bow", extra: () => bot.giveItem(new mc.ItemStack("minecraft:arrow", 5)) },
            { item: "minecraft:ender_pearl" }
        ];
        const validItems = items.filter(entry => !entry.condition || entry.condition());
        if (validItems.length > 0) {
            const entry = validItems[Math.floor(Math.random() * validItems.length)];
            bot.setItem(new mc.ItemStack(entry.item), 0, true);
            bot.useItemInSlot(0);
            mc.system.runTimeout(() => {
                try {
                    bot.stopUsingItem();
                    if (closest) {
                        bot.lookAtEntity(closest, test.LookDuration.Continuous);
                        bot.attackEntity(closest);
                    }
                }
                catch { }
            }, ticksConvertor(0.5));
            if (entry.extra) {
                entry.extra();
            }
        }
    }
}
function useElytra(bot) {
    const armorInv = bot.getComponent(mc.EntityComponentTypes.Equippable);
    const item1 = new mc.ItemStack('minecraft:elytra');
    const item2 = new mc.ItemStack('minecraft:firework_rocket', 3);
    armorInv?.setEquipment(mc.EquipmentSlot.Chest, item1);
    bot.setItem(item2, 0, true);
    bot.glide();
    mc.system.runTimeout(() => {
        try {
            bot.useItemInSlot(0);
            mc.system.runTimeout(() => {
                try {
                    bot.stopUsingItem();
                }
                catch { }
            }, ticksConvertor(0.5));
        }
        catch { }
    }, ticksConvertor(0.25));
}
function stopAll(bot) {
    const dataTimer = timers.get(bot.id);
    if (dataTimer) {
        mc.system.clearRun(dataTimer);
    }
    bot.stopBreakingBlock();
    bot.stopBuild();
    bot.stopFlying();
    bot.stopGliding();
    bot.stopInteracting();
    bot.stopMoving();
    bot.stopSwimming();
    bot.stopUsingItem();
    bot.isSprinting = false;
    bot.isSneaking = false;
}
export { checkactions, startAttack };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
