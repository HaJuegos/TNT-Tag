/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { TicksPerSecond, world } from "@minecraft/server";
/**
 * Lista de comandos que siempre se ponen al iniciar el mundo.
 * @type {string[]}
 */
export const setupCommands = [
    `gamerule commandblocksenabled false`,
    `gamerule sendcommandfeedback false`,
    `gamerule domobspawning true`,
    `gamerule commandblockoutput false`,
    `gamerule dodaylightcycle false`,
    `gamerule doentitydrops false`,
    `gamerule dofiretick false`,
    `gamerule doimmediaterespawn true`,
    `gamerule doinsomnia false`,
    `gamerule dolimitedcrafting true`,
    `gamerule domobloot false`,
    `gamerule dotiledrops false`,
    `gamerule doweathercycle false`,
    `gamerule drowningdamage false`,
    `gamerule falldamage false`,
    `gamerule firedamage false`,
    `gamerule freezedamage false`,
    `gamerule keepinventory true`,
    `gamerule mobgriefing false`,
    `gamerule naturalregeneration false`,
    `gamerule playerssleepingpercentage 99999`,
    `gamerule projectilescanbreakblocks false`,
    `gamerule pvp true`,
    `gamerule randomtickspeed 0`,
    `gamerule recipesunlock true`,
    `gamerule respawnblocksexplode false`,
    `gamerule showbordereffect false`,
    `gamerule showcoordinates true`,
    `gamerule showdaysplayed false`,
    `gamerule showdeathmessages false`,
    `gamerule showrecipemessages true`,
    `gamerule showtags false`,
    `gamerule tntexplodes false`,
    `scoreboard objectives add mapSelected dummy`,
    `scoreboard objectives add totalFireworkds dummy`,
    // Data-scores
    `scoreboard objectives add totalPoints dummy`,
    `scoreboard objectives add totalWin dummy`,
    `scoreboard objectives add totalDed dummy`,
    `scoreboard objectives add totalShop dummy`,
    `scoreboard objectives add totalVoted dummy`,
    `scoreboard objectives add totalTNT dummy`,
    // Timers de Power ups
    `scoreboard objectives add timerCoin dummy`,
    `scoreboard objectives add cooldownPower dummy`,
    `scoreboard objectives add timerGlow dummy`,
    `scoreboard objectives add timerNet dummy`,
    // Timers del Juego
    `scoreboard objectives add winStack dummy scoreboard.nameWinningTotal`,
    `scoreboard objectives add totalVotesView dummy scoreboard.voteTotal`,
    `scoreboard objectives add totalVotes dummy`,
    `scoreboard objectives add timerVotations dummy`,
    `scoreboard objectives add totalInGame dummy scoreboard.nameAllPlayers`,
    `scoreboard objectives add timerInGame dummy`,
];
/**
 * Lista de elementos que se ocultan cuando un jugador entra al mundo.
 * @type {string[]}
 */
export const hideElements = [
    `hud @s hide health`,
    `hud @s hide hunger`,
    `hud @s hide air_bubbles`,
    `hud @s hide armor`,
    `hud @s hide horse_health`,
    `hud @s hide progress_bar`,
    `gamemode a`
];
/**
 * Obtiene todas las entidades en todas las dimensiones
 * @param {EntityQueryOptions} filters (Opcional) Filtros para obtener dichas entidades.
 * @returns {Entity[]} Devuelve un Array con las entidades obtenidas. El array estaria vacio en caso de no encontrar nada.
 */
export function getAllEntitiesInAllDime(filters = {}) {
    const entitiesMap = new Map();
    const allEntities = [
        ...world.getDimension('overworld').getEntities(filters),
        ...world.getDimension('nether').getEntities(filters),
        ...world.getDimension('the_end').getEntities(filters)
    ];
    for (const entity of allEntities) {
        entitiesMap.set(entity.id, entity);
    }
    return Array.from(entitiesMap.values());
}
/**
 * Convierte un Codigo Hexadecimal en un {@link RGB}.
 * @param {string} colorHex Color Hexadecimal.
 * @returns {RGB} Devuelve el color convertido en un {@link RGB}.
 */
export function RGBFloatConvertor(colorHex) {
    const red = parseInt(colorHex.slice(1, 3), 16) / 255;
    const green = parseInt(colorHex.slice(3, 5), 16) / 255;
    const blue = parseInt(colorHex.slice(5, 7), 16) / 255;
    return { red, green, blue };
}
/**
 * Convierte segundos a ticks.
 * @param {number} seconds La cantidad de segundos a convertir.
 * @returns {number} La cantidad equivalente de ticks de juego.
 * @example
 * const ticks = ticksConvertor(5); // Devuelve 100 (5 segundos * 20 ticks por segundo)
 */
export function ticksConvertor(seconds) {
    return seconds * TicksPerSecond;
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
