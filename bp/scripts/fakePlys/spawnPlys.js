/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from '@minecraft/server';
import * as gametest from '@minecraft/server-gametest';
const listOfBots = [];
gametest.register('ha', 'summon_fake_plys', (test) => {
    try {
        generateFakePly(test, 35);
        mc.system.runTimeout(() => {
            startBots(listOfBots);
        }, mc.TicksPerSecond * 5);
    }
    catch { }
})
    .maxAttempts(99999)
    .maxTicks(mc.TicksPerSecond * 99999)
    .required(false)
    .structureName('ha:no')
    .tag('ha')
    .requiredSuccessfulAttempts(9999);
function generateFakePly(test, total = 5) {
    const coords = { x: 2025.57, y: -58.00, z: -1970.43 };
    for (let i = 1; i <= total; i++) {
        const bot = test.spawnSimulatedPlayer({ x: 0, y: 1, z: 0 }, `Bot${i}`, mc.GameMode.adventure);
        bot.teleport(coords);
        listOfBots.push(bot);
    }
}
function startBots(bots) {
    for (const bot of bots) {
        mc.system.runInterval(() => {
            if (bot.hasTag('inNet')) {
                netBehavior(bot);
            }
            else if (bot.hasTag('normalPly')) {
                normalBehavior(bot);
            }
            else if (bot.hasTag('tntPly')) {
                tntBehavior(bot);
            }
            else if (bot.hasTag('spectMode')) {
                spectBehavior(bot);
            }
            else {
                stopAll(bot);
            }
        }, mc.TicksPerSecond * 1);
    }
}
function spectBehavior(bot) {
    stopAll(bot);
    const players = mc.world.getAllPlayers().filter(ply => !ply.hasTag('spectMode'));
    if (players.length > 0) {
        const targetPlayerIndex = Math.floor((Date.now() / 5000) + bot.name.length) % players.length;
        const targetPlayer = players[targetPlayerIndex];
        bot.lookAtEntity(targetPlayer);
    }
}
function tntBehavior(bot) {
    stopAll(bot);
    if (bot.isInWater) {
        waterScape(bot);
        return;
    }
    checkBlock(bot);
    const allPlys = mc.world.getAllPlayers();
    const normalPlys = allPlys.filter(player => player.hasTag('normalPly'));
    const nearPlys = getNearPlayers(bot, {
        type: 'minecraft:player',
        location: bot.location,
        minDistance: 0,
        maxDistance: 6,
        excludeTags: ['spectMode', 'tntPly'],
        excludeNames: [bot.name]
    });
    if (nearPlys.length > 0) {
        nearPlys.sort((a, b) => {
            const distA = calculateDistance(bot.location, a.location);
            const distB = calculateDistance(bot.location, b.location);
            return distA - distB;
        });
        const closestPly = nearPlys[0];
        if (Math.random() > 0.35) {
            equipItems(bot);
        }
        bot.lookAtEntity(closestPly);
        stopAll(bot);
        mc.system.runTimeout(() => {
            bot.isSprinting = true;
            const e = bot.navigateToEntity(closestPly);
            if (!e.isFullPath) {
                const direction = {
                    x: closestPly.location.x - bot.location.x,
                    z: closestPly.location.z - bot.location.z
                };
                const magnitude = Math.sqrt(direction.x ** 2 + direction.z ** 2) || 1;
                const normalizedDirection = {
                    x: direction.x / magnitude,
                    z: direction.z / magnitude
                };
                bot.moveRelative(normalizedDirection.x, normalizedDirection.z);
            }
            const s = bot.useItemInSlot(0);
            if (!s) {
                bot.attackEntity(closestPly);
            }
            else {
                mc.system.runTimeout(() => {
                    bot.stopUsingItem();
                    bot.attackEntity(closestPly);
                }, mc.TicksPerSecond * 1);
            }
        }, mc.TicksPerSecond * 0.2);
    }
    else if (normalPlys.length > 0) {
        let closestNormalPly = normalPlys[0];
        let minDistance = calculateDistance(bot.location, normalPlys[0].location);
        for (let i = 1; i < normalPlys.length; i++) {
            const dist = calculateDistance(bot.location, normalPlys[i].location);
            if (dist < minDistance) {
                minDistance = dist;
                closestNormalPly = normalPlys[i];
            }
        }
        bot.lookAtEntity(closestNormalPly);
        bot.isSprinting = true;
        const s = bot.navigateToEntity(closestNormalPly);
        if (!s.isFullPath) {
            const direction = {
                x: closestNormalPly.location.x - bot.location.x,
                z: closestNormalPly.location.z - bot.location.z
            };
            const magnitude = Math.sqrt(direction.x ** 2 + direction.z ** 2) || 1;
            const normalizedDirection = {
                x: direction.x / magnitude,
                z: direction.z / magnitude
            };
            bot.moveRelative(normalizedDirection.x, normalizedDirection.z);
        }
    }
    else {
        const behaviorRoll = Math.random();
        if (behaviorRoll < 0.6) {
            const botId = bot.nameTag.length;
            const timeBasedSeed = Math.floor(Date.now() / 1000) % 100;
            const uniqueSeed = (botId * 17 + timeBasedSeed) % 100;
            const angle = (uniqueSeed / 100) * 2 * Math.PI + (Math.random() * Math.PI);
            const distance = 2 + Math.random() * 3;
            const randomWalkCoords = {
                x: bot.location.x + Math.cos(angle) * distance,
                y: bot.location.y,
                z: bot.location.z + Math.sin(angle) * distance
            };
            const direction = {
                x: randomWalkCoords.x - bot.location.x,
                z: randomWalkCoords.z - bot.location.z
            };
            const mag = Math.sqrt(direction.x ** 2 + direction.z ** 2) || 1;
            const normalizedDirection = {
                x: direction.x / mag,
                z: direction.z / mag
            };
            const yaw = Math.atan2(direction.z, direction.x) * (180 / Math.PI);
            const speed = 0.5 + Math.random() * 0.5;
            bot.setBodyRotation(yaw);
            bot.lookAtLocation(randomWalkCoords);
            bot.moveToLocation(randomWalkCoords, { faceTarget: true, speed: speed });
            if (Math.random() > 0.5) {
                bot.moveRelative(normalizedDirection.x, normalizedDirection.z);
            }
        }
        if (Math.random() > 0.95) {
            bot.jump();
        }
        if (Math.random() > 0.95) {
            bot.isSneaking = true;
        }
        if (Math.random() > 0.65) {
            if (Math.random() > 0.6) {
                equipItems(bot);
            }
            const nearbyPlayers = getNearbyPlayers(bot, 7);
            const validTargets = nearbyPlayers.filter(ply => !ply.hasTag('tntPly') && !ply.hasTag('spectMode'));
            if (validTargets.length > 0) {
                const randomPly = validTargets[Math.floor(Math.random() * validTargets.length)];
                stopAll(bot);
                bot.lookAtEntity(randomPly);
                mc.system.runTimeout(() => {
                    const s = bot.useItemInSlot(0);
                    if (!s) {
                        bot.attackEntity(randomPly);
                    }
                    else {
                        mc.system.runTimeout(() => {
                            bot.stopUsingItem();
                            bot.attackEntity(randomPly);
                        }, mc.TicksPerSecond * 1);
                    }
                }, mc.TicksPerSecond * 0.2);
            }
        }
    }
}
function normalBehavior(bot) {
    stopAll(bot);
    if (bot.isInWater) {
        waterScape(bot);
        return;
    }
    checkBlock(bot);
    const nearPlys = getNearbyPlayers(bot, 10);
    const tntPlayers = nearPlys.filter(player => player.hasTag('tntPly'));
    if (tntPlayers.length > 0) {
        const closestTntPlayer = tntPlayers[0];
        const directionFromTnt = {
            x: bot.location.x - closestTntPlayer.location.x,
            z: bot.location.z - closestTntPlayer.location.z
        };
        const magnitude = Math.sqrt(directionFromTnt.x ** 2 + directionFromTnt.z ** 2) || 1;
        const jitterFactor = 0.4;
        const escapeRadius = 12;
        const randomizedDirection = {
            x: (directionFromTnt.x / magnitude) + (Math.random() * jitterFactor * 2 - jitterFactor),
            z: (directionFromTnt.z / magnitude) + (Math.random() * jitterFactor * 2 - jitterFactor)
        };
        const newMagnitude = Math.sqrt(randomizedDirection.x ** 2 + randomizedDirection.z ** 2) || 1;
        const escapeCoords = {
            x: bot.location.x + (randomizedDirection.x / newMagnitude) * escapeRadius,
            y: bot.location.y,
            z: bot.location.z + (randomizedDirection.z / newMagnitude) * escapeRadius
        };
        const yaw = Math.atan2(randomizedDirection.z, randomizedDirection.x) * (180 / Math.PI);
        bot.isSprinting = true;
        bot.lookAtLocation(escapeCoords);
        bot.moveRelative(randomizedDirection.x / newMagnitude, randomizedDirection.z / newMagnitude);
        bot.setBodyRotation(yaw);
        if (Math.random() > 0.35) {
            if (Math.random() > 0.35) {
                equipItems(bot);
            }
            const nearbyPlayers = getNearbyPlayers(bot, 8);
            if (nearbyPlayers.length > 0) {
                const randomPly = nearbyPlayers[Math.floor(Math.random() * nearbyPlayers.length)];
                bot.lookAtEntity(randomPly);
                const s = bot.useItemInSlot(0);
                if (!s) {
                    bot.attackEntity(randomPly);
                }
                else {
                    mc.system.runTimeout(() => {
                        bot.stopUsingItem();
                        bot.attackEntity(randomPly);
                    }, mc.TicksPerSecond * 1);
                }
            }
        }
    }
    else {
        const behaviorRoll = Math.random();
        if (behaviorRoll < 0.6) {
            const botId = bot.nameTag.length;
            const timeBasedSeed = Math.floor(Date.now() / 1000) % 100;
            const uniqueSeed = (botId * 17 + timeBasedSeed) % 100;
            const angle = (uniqueSeed / 100) * 2 * Math.PI + (Math.random() * Math.PI);
            const distance = 2 + Math.random() * 3;
            const randomWalkCoords = {
                x: bot.location.x + Math.cos(angle) * distance,
                y: bot.location.y,
                z: bot.location.z + Math.sin(angle) * distance
            };
            const direction = {
                x: randomWalkCoords.x - bot.location.x,
                z: randomWalkCoords.z - bot.location.z
            };
            const mag = Math.sqrt(direction.x ** 2 + direction.z ** 2) || 1;
            const normalizedDirection = {
                x: direction.x / mag,
                z: direction.z / mag
            };
            const yaw = Math.atan2(direction.z, direction.x) * (180 / Math.PI);
            bot.setBodyRotation(yaw);
            bot.lookAtLocation(randomWalkCoords);
            const speed = 0.5 + Math.random() * 0.5;
            bot.moveToLocation(randomWalkCoords, { faceTarget: true, speed: speed });
            if (Math.random() > 0.5) {
                bot.moveRelative(normalizedDirection.x, normalizedDirection.z);
            }
        }
        if (Math.random() > 0.95) {
            bot.jump();
        }
        if (Math.random() > 0.95) {
            bot.isSneaking = true;
        }
        if (Math.random() > 0.65) {
            if (Math.random() > 0.6) {
                equipItems(bot);
            }
            const nearbyPlayers = getNearbyPlayers(bot, 7);
            if (nearbyPlayers.length > 0) {
                const randomPly = nearbyPlayers[Math.floor(Math.random() * nearbyPlayers.length)];
                bot.lookAtEntity(randomPly);
                const s = bot.useItemInSlot(0);
                if (!s) {
                    bot.attackEntity(randomPly);
                }
                else {
                    mc.system.runTimeout(() => {
                        bot.stopUsingItem();
                        bot.attackEntity(randomPly);
                    }, mc.TicksPerSecond * 1);
                }
            }
        }
    }
}
function waterScape(bot) {
    const escapeRadius = 10;
    const randomXOffset = (Math.random() * escapeRadius * 2 - escapeRadius);
    const randomZOffset = (Math.random() * escapeRadius * 2 - escapeRadius);
    const randomCoords = {
        x: Math.floor(bot.location.x + randomXOffset),
        y: Math.floor(bot.location.y + 2),
        z: Math.floor(bot.location.z + randomZOffset),
    };
    const shouldJump = Math.random() > 0.7;
    const knockbackX = bot.location.x + (Math.random() * escapeRadius * 2 - escapeRadius);
    const knockbackZ = bot.location.z + (Math.random() * escapeRadius * 2 - escapeRadius);
    const knockbackImpulse = 0.15 + Math.random() * (1.35 - 0.15);
    if (bot.isInWater) {
        bot.swim();
        if (shouldJump) {
            bot.jump();
        }
    }
    else {
        bot.stopSwimming();
    }
    bot.isSprinting = true;
    bot.applyKnockback({ x: knockbackX, z: knockbackZ }, knockbackImpulse);
    bot.navigateToLocation(randomCoords);
    if (Math.random() > 0.6) {
        if (Math.random() > 0.35) {
            equipItems(bot);
        }
        const nearbyPlayers = getNearbyPlayers(bot, 5);
        const validTargets = nearbyPlayers.filter(ply => {
            if (bot.hasTag('tntPly') && ply.hasTag('tntPly'))
                return false;
            if (ply.hasTag('spectMode'))
                return false;
            return true;
        });
        if (validTargets.length > 0) {
            const randomPly = validTargets[Math.floor(Math.random() * validTargets.length)];
            bot.lookAtEntity(randomPly);
            const s = bot.useItemInSlot(0);
            if (!s) {
                bot.attackEntity(randomPly);
            }
            else {
                mc.system.runTimeout(() => {
                    bot.stopUsingItem();
                    bot.attackEntity(randomPly);
                }, mc.TicksPerSecond * 1);
            }
        }
    }
}
function netBehavior(bot) {
    stopAll(bot);
    if (Math.random() > 0.35) {
        if (Math.random() > 0.35) {
            equipItems(bot);
        }
        const nearbyPlayers = getNearbyPlayers(bot, 7);
        const validTargets = nearbyPlayers.filter(ply => {
            if (bot.hasTag('tntPly') && ply.hasTag('tntPly'))
                return false;
            if (ply.hasTag('spectMode'))
                return false;
            return true;
        });
        if (validTargets.length > 0) {
            const randomPly = nearbyPlayers[Math.floor(Math.random() * nearbyPlayers.length)];
            bot.lookAtEntity(randomPly);
            const s = bot.useItemInSlot(0);
            if (!s) {
                bot.attackEntity(randomPly);
            }
            else {
                mc.system.runTimeout(() => {
                    bot.stopUsingItem();
                    bot.attackEntity(randomPly);
                }, mc.TicksPerSecond * 1);
            }
        }
    }
}
function stopAll(bot) {
    bot.isSneaking = false;
    bot.isSprinting = false;
    bot.stopInteracting();
    bot.stopUsingItem();
    bot.stopMoving();
    bot.stopSwimming();
}
function equipItems(bot) {
    const itemsToGive = [
        { tag: 'ha:coin', item: 'ha:coin', condition: bot.hasTag('normalPly') },
        { tag: 'ha:companion_cube', item: 'ha:companion_cube' },
        { tag: 'ha:super_compass', item: 'ha:super_compass', condition: bot.hasTag('tntPly') },
        { tag: 'ha:net_gun', item: 'ha:net_gun' },
        { tag: 'ha:rolling_players', item: 'ha:rolling_players', condition: bot.hasTag('tntPly') },
        { tag: 'ha:tnt_projectile', item: 'ha:tnt_projectile', condition: bot.hasTag('tntPly') },
        { tag: 'ha:wing', item: 'ha:wing' },
        { tag: 'minecraft:bow', item: 'minecraft:bow', secondaryItem: 'minecraft:arrow' },
        { tag: 'minecraft:wind_charge', item: 'minecraft:wind_charge' }
    ];
    const filteredItems = itemsToGive.filter(({ condition }) => condition == undefined || condition);
    if (filteredItems.length > 0) {
        const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
        const primaryItem = new mc.ItemStack(randomItem.item);
        bot.giveItem(primaryItem, true);
        if (randomItem.secondaryItem) {
            const secondary = new mc.ItemStack(randomItem.secondaryItem, 64);
            bot.giveItem(secondary, false);
        }
    }
}
function checkBlock(bot) {
    const block = bot.getBlockFromViewDirection()?.block;
    if (block && !block.isAir) {
        bot.interactWithBlock(block.location);
    }
}
function getNearbyPlayers(bot, radius = 7) {
    const nearbyEntities = bot.dimension.getEntities({
        type: "minecraft:player",
        location: bot.location,
        minDistance: 0,
        maxDistance: radius,
        excludeNames: [bot.name],
        excludeTags: ["spectMode"]
    });
    return nearbyEntities;
}
function getNearPlayers(bot, filters = {}) {
    return bot.dimension.getEntities(filters);
}
function calculateDistance(loc1, loc2) {
    const dx = loc1.x - loc2.x;
    const dy = loc1.y - loc2.y;
    const dz = loc1.z - loc2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
