/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';
import * as test from '@minecraft/server-gametest';

import * as fns from './fns';

import { ticksConvertor } from '../globalVariables';

interface BotTimer {
    actionTimer?: number;
    attackTimer?: number;
    lastActionTime: number;
    lastAttackTime: number;
    actionDelay: number;
    attackDelay: number;
}

const botTimers = new Map<string, BotTimer>();
export const listOfBots: test.SimulatedPlayer[] = [];

test.register('ha', 'spawn_fake_plys', ((Test) => {
    try {
        spawnBots(Test, 5);
    } catch { }
})).maxAttempts(99999)
    .maxTicks(mc.TicksPerSecond * 99999)
    .required(false)
    .structureName('ha:no')
    .tag('ha')
    .requiredSuccessfulAttempts(9999);

mc.world.afterEvents.worldLoad.subscribe(() => {
    try {
        mc.system.runInterval(() => {
            try {
                const currentTime = Date.now();

                for (const bot of listOfBots) {
                    if (!botTimers.has(bot.id)) {
                        initializeBotTimer(bot.id);
                    }

                    const botTimer = botTimers.get(bot.id)!;

                    if (currentTime - botTimer.lastActionTime >= botTimer.actionDelay) {
                        fns.checkactions(bot);
                        botTimer.lastActionTime = currentTime;
                        botTimer.actionDelay = getRandomDelay(800, 1500);
                    }

                    if (currentTime - botTimer.lastAttackTime >= botTimer.attackDelay) {
                        handleBotAttacks(bot);
                        botTimer.lastAttackTime = currentTime;
                        botTimer.attackDelay = getRandomDelay(2000, 6000);
                    }
                }
            } catch { }
        }, ticksConvertor(0.1));
    } catch { }
});

function handleBotAttacks(bot: test.SimulatedPlayer): void {
    try {
        let attackChance = 0;

        if (bot.hasTag('tntPly')) {
            attackChance = 1;
        } else if (bot.hasTag('normalPly')) {
            attackChance = 0.5;
        } else if (bot.hasTag('inNet')) {
            attackChance = 0.2;
        }

        if (Math.random() < attackChance) {
            if (bot.hasTag('normalPly') || bot.hasTag('inNet')) {
                if (Math.random() < 0.75) {
                    fns.startAttack(bot, 'tntPly');
                } else {
                    fns.startAttack(bot, 'normalPly');
                }
            }

            if (bot.hasTag('tntPly')) {
                fns.startAttack(bot, 'normalPly');
            }
        }
    } catch { }
}

function initializeBotTimer(botId: string): void {
    const currentTime = Date.now();

    botTimers.set(botId, {
        lastActionTime: currentTime - Math.random() * 1000,
        lastAttackTime: currentTime - Math.random() * 3000,
        actionDelay: getRandomDelay(800, 1500),
        attackDelay: getRandomDelay(2000, 6000)
    });
}

/**
 * Funcion encargada de spawnear los bots
 * @param {test.Test} test Argumento {@link test.Test} obligatorio de gametest para spawnear los bots.
 * @param {number} total (Opcional, default: 1) Cantidad a spawnear de bots.
 * @returns {void}
 */
function spawnBots(test: test.Test, total: number = 1): void {
    const worldSpawn = mc.world.getDefaultSpawnLocation();

    for (let i = 0; i < total; i++) {
        const ply = test.spawnSimulatedPlayer({ x: 0, y: 2, z: 0 }, `Bot${i}`, mc.GameMode.adventure);

        ply.runCommand(`spreadplayers ${worldSpawn.x} ${worldSpawn.z} 0 10 @s`);
        listOfBots.push(ply);
    }
}

function getRandomDelay(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */