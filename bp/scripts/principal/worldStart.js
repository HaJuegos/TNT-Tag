/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Dimension, Entity, TicksPerSecond, world } from '@minecraft/server';

import { setupCommand } from './variables';
import { checkGamePlayer, playerSetup } from '../functions/playerFunctions';
import { checkVariantMob } from '../functions/interactsFunctions';
import { inVotations } from '../functions/voteFunctions';
import { gameStarted } from '../functions/loopFunctions';

export const overworld = world.getDimension('overworld');
export const scoreboard = world.scoreboard;

world.beforeEvents.worldInitialize.subscribe(_worldInit => {
    try {
        setupCommand.forEach(async arg => {
            await null;
            overworld.runCommand(arg);
        });
    } catch {};
});

world.afterEvents.playerSpawn.subscribe(plySpawn => {
    try {
        const { player } = plySpawn;
        playerSetup(player);
        checkGamePlayer(player);
    } catch {};
});

world.beforeEvents.playerInteractWithEntity.subscribe(async interactSensor => {
    try {
        const { target: entity, player } = interactSensor;

        if (entity.typeId == 'ha:generator_entity') {
            await null;
            checkVariantMob(player, entity);
        };
    } catch {};
});

world.afterEvents.buttonPush.subscribe(async interactBlock => {
    try {
        const { source: player, block } = interactBlock;

        if (inVotations || gameStarted) return;

        if (block.typeId == 'minecraft:stone_button') {
            const coords = block.location;

            if (coords.x == 2035 && coords.y == 53 && coords.z == -1977) {
                await null;
                player.runCommand(`scriptevent ha:check_players`);
            };
        } else if (block.typeId == 'minecraft:warped_button') {
            const coords = block.location;

            if (coords.x == 1947 && coords.y == 61 && coords.z == -2008) {
                await null;
                player.runCommand(`function regaloomaga`);
            };
        };
    } catch {};
});

/**
 * Convierte cualquier numero a ticks de Minecraft.
 * @param {Number} seconds Valor a convertir.
 * @returns {Number} Numero convertido a ticks.
 * @throws Si el argumento no es un numero, mandara error.
 *
 * @example
 * // Convierte 5 segundos a ticks (20 ticks por segundo).
 * const ticks = ticksConvertor(5);
 */
export function ticksConvertor(seconds) {
    if (isNaN(seconds)) {
        throw new Error(`El valor ${seconds} no es un argumento valido.`);
    };

    return TicksPerSecond * seconds;
};

/**
 * Obtiene entidades/jugadores con ciertas condiciones en un array.
 * @param {import('@minecraft/server').EntityQueryOptions | undefined} filters Condiciones opcionales. Por defecto no tendra filtros.
 * @param {Dimension} dimension Dimension opcional donde se obtiene las entidades/jugadores. Por defecto estara el Overworld.
 * @returns {Entity[]} El array de entidades/jugadores.
 * @example
 *
 * // Obtiene y devuelve todas las entidades del Overworld, ya que no tiene filtros.
 * const var = getSpecificPlayers();
 *
 * // Obtiene y devuelve solo zombies del overworld, debido al filtro aplicado
 * const var = getSpecificPlayers({ type: 'minecraft:zombie' });
 *
 * // Obtiene y devuelve todos los jguadores que esten en el nether
 * const var = getSpecificPlayers({ type: 'minecraft:player' }, world.getDimension('nether'));
 */
export function getSpecificEntities(filters = undefined, dimension = overworld) {
    return dimension.getEntities(filters);
};

/**
 * Convierte un valor de color hexadecimal a un RGB Float.
 * @param {string} hex Valor Hexadecimal.
 * @returns {import('@minecraft/server').RGB} Devuelve un color RGB Float.
 * @example
 *
 * // Esto devolvera el color negro en valor Float RGB.
 * RGBFloatConvertor("#000000");
 */
export function RGBFloatConvertor(hex) {
    hex = hex.replace(/^#/, '');

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    };

    const red = parseInt(hex.slice(0, 2), 16) / 255;
    const green = parseInt(hex.slice(2, 4), 16) / 255;
    const blue = parseInt(hex.slice(4, 6), 16) / 255;

    return { red: red, green: green, blue: blue };
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */