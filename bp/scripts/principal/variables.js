/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

/**
 * Todos los comandos que se ejecutan cuando el mundo se inicia
 */
export const setupCommand = [
    `difficulty p`,
	`gamerule commandblocksenabled true`,
    `gamerule commandblockoutput false`,
    `gamerule dodaylightcycle false`,
    `gamerule dofiretick false`,
    `gamerule doimmediaterespawn true`,
    `gamerule doinsomnia false`,
    `gamerule dolimitedcrafting true`,
    `gamerule domobloot false`,
    `gamerule domobspawning true`,
    `gamerule dotiledrops false`,
    `gamerule doweathercycle false`,
    `gamerule falldamage false`,
    `gamerule firedamage false`,
    `gamerule freezedamage false`,
    `gamerule keepinventory true`,
    `gamerule mobgriefing false`,
    `gamerule naturalregeneration true`,
    `gamerule playerssleepingpercentage 9999`,
    `gamerule pvp true`,
    `gamerule randomtickspeed 1`,
    `gamerule recipesunlock true`,
    `gamerule respawnblocksexplode false`,
    `gamerule sendcommandfeedback false`,
    `gamerule showbordereffect false`,
    `gamerule showcoordinates true`,
    `gamerule showrecipemessages true`,
    `gamerule showtags false`,
    `gamerule spawnradius 1`,
    `gamerule tntexplodes false`,
    `scoreboard objectives add totalAllPlayers dummy scoreboard.nameAllPlayers`,
    `scoreboard objectives add loopVotations dummy`,
    `scoreboard objectives add totalInGame dummy`,
    `scoreboard objectives add winStack dummy scoreboard.nameWinningTotal`,
    `scoreboard objectives add players dummy`,
    `scoreboard objectives add tntPlayers dummy`,
    `scoreboard objectives add totalVotes dummy scoreboard.voteTotal`,
    `scoreboard objectives add coinsPlys dummy`
];

/**
 * Zonas de spawn del mapa 1.
 */
export const spawnZonesMap1 = [
    { x: 15, y: -60, z: -116 },
    { x: 17, y: -61, z: -155 },
    { x: -53, y: -60, z: -156 },
    { x: -60, y: -55, z: -156 },
    { x: -47, y: -52, z: -136 },
    { x: 12, y: -46, z: -82 },
    { x: -43, y: -61, z: -198 },
    { x: 46.64, y: -60.11, z: -139.80 },
    { x: 12.44, y: -46.50, z: -118.51 },
    { x: -9.48, y: -54.00, z: -118.42 },
    { x: 15.41, y: -39.94, z: -114.22 },
    { x: 14.54, y: -30.00, z: -121.37 },
    { x: 14.14, y: -28.00, z: -169.60 },
    { x: 16.00, y: -16.00, z: -120.38 }
];

/**
 * Zonas de spawn del mapa 2.
 */
export const spawnZonesMap2 = [
    { x: 23.74, y: -55.00, z: 31.80 },
    { x: 26.18, y: -50.50, z: 13.39 },
    { x: 12.52, y: -43.00, z: 16.05 },
    { x: 7.85, y: -45.00, z: 30.71 },
    { x: 7.29, y: -54.38, z: 44.55 },
    { x: 18.60, y: -51.00, z: 46.49 },
    { x: 35.70, y: -47.00, z: 39.23 }
];

/**
 * Zonas de spawn del mapa 3.
 */
export const spawnZonesMap3 = [
    { x: 158.39, y: -48.00, z: 19.10 },
    { x: 143.80, y: -48.00, z: 27.83 },
    { x: 139.04, y: -46.44, z: 41.23 },
    { x: 162.45, y: -48.50, z: 36.13 },
    { x: 170.45, y: -44.00, z: 31.36 },
    { x: 170.77, y: -48.00, z: 7.55 },
    { x: 168.04, y: -48.04, z: -1.26 },
    { x: 170.53, y: -46.82, z: -7.44 },
    { x: 157.71, y: -43.00, z: 0.52 },
    { x: 145.42, y: -48.27, z: -9.67 },
    { x: 138.30, y: -45.00, z: -8.70 }
];

/**
 * Zonas de spawn del mapa 4.
 */
export const spawnZonesMap4 = [
    { x: 223.10, y: -42.00, z: -46.11 },
    { x: 227.51, y: -51.00, z: -48.35 },
    { x: 203.76, y: -51.00, z: -52.05 },
    { x: 196.38, y: -51.00, z: -63.93 },
    { x: 186.10, y: -51.00, z: -78.23 },
    { x: 189.70, y: -51.00, z: -106.52 },
    { x: 201.78, y: -45.00, z: -67.12 },
    { x: 210.95, y: -51.00, z: -89.79 },
    { x: 232.97, y: -51.00, z: -86.70 },
    { x: 225.00, y: -51.00, z: -82.52 },
    { x: 211.44, y: -46.00, z: -102.78 },
    { x: 197.17, y: -35.00, z: -95.12 },
    { x: 199.13, y: -51.00, z: -95.50 },
    { x: 198.64, y: -39.00, z: -96.14 }
];

/**
 * Zonas de spawn del mapa 5.
 */
export const spawnZonesMap5 = [
    { x: 360.50, y: -57.00, z: 123.42 },
    { x: 351.96, y: -56.00, z: 144.29 },
    { x: 339.01, y: -56.00, z: 101.36 },
    { x: 371.00, y: -56.00, z: 105.20 },
    { x: 379.12, y: -49.00, z: 96.43 },
    { x: 390.70, y: -52.44, z: 96.01 },
    { x: 393.70, y: -56.00, z: 108.22 }
];

/**
 * Zonas de spawn del mapa 6.
 */
export const spawnZonesMap6 = [
    { x: 220.53, y: -48.00, z: 404.53 },
    { x: 220.58, y: -53.00, z: 404.39 },
    { x: 219.70, y: -56.00, z: 404.52 },
    { x: 220.74, y: -56.00, z: 403.66 },
    { x: 221.35, y: -56.00, z: 404.77 },
    { x: 239.86, y: -46.00, z: 421.07 },
    { x: 240.25, y: -46.00, z: 388.69 },
    { x: 201.48, y: -46.00, z: 388.43 },
    { x: 199.51, y: -46.00, z: 420.29 },
    { x: 241.25, y: -46.00, z: 421.72 },
    { x: 220.30, y: -53.00, z: 429.70 },
    { x: 196.30, y: -53.00, z: 404.30 }
];

/**
 * Zonas de spawn del mapa 7.
 */
export const spawnZonesMap7 = [
    { x: -57.55, y: -28.00, z: 437.48 },
    { x: -89.54, y: -28.00, z: 437.49 },
    { x: -46.07, y: -28.00, z: 437.69 },
    { x: -0.48, y: -27.00, z: 434.60 },
    { x: -9.47, y: -28.00, z: 428.54 },
    { x: -9.39, y: -28.00, z: 415.58 },
    { x: -3.56, y: -28.00, z: 393.40 },
    { x: -29.48, y: -27.50, z: 414.46 },
    { x: -19.34, y: -33.00, z: 428.66 },
    { x: -24.58, y: -31.00, z: 396.37 },
    { x: -42.52, y: -26.00, z: 457.39 },
    { x: -75.54, y: -39.00, z: 464.44 },
    { x: -57.54, y: -35.00, z: 443.45 },
    { x: -75.46, y: -38.00, z: 421.45 },
    { x: -78.50, y: -36.00, z: 380.72 },
    { x: -65.36, y: -37.06, z: 396.38 },
    { x: -48.65, y: -24.00, z: 404.51 },
    { x: -42.62, y: -28.00, z: 390.45 },
    { x: -33.55, y: -36.00, z: 378.51 },
    { x: -34.59, y: -44.00, z: 406.46 },
    { x: 3.39, y: -40.00, z: 414.45 },
    { x: -3.35, y: -40.00, z: 375.63 },
    { x: -8.51, y: -43.00, z: 394.36 },
    { x: -51.61, y: -42.00, z: 428.46 },
    { x: -18.34, y: -37.00, z: 453.59 },
    { x: -17.47, y: -44.06, z: 426.54 },
    { x: -63.35, y: -28.00, z: 414.43 }
];

/**
 * Zonas de spawn del mapa 8.
 */
export const spawnZonesMap8 = [
    { x: -269.39, y: -11.00, z: -69.98 },
    { x: -274.06, y: -7.00, z: -78.57 },
    { x: -284.81, y: -12.00, z: -85.10 },
    { x: -287.63, y: -7.00, z: -73.43 },
    { x: -282.63, y: -7.00, z: -63.49 },
    { x: -258.80, y: -9.50, z: -77.43 },
    { x: -287.86, y: -17.00, z: -73.65 },
    { x: -275.52, y: -14.00, z: -82.30 }
];

/**
 * Zonas de spawn del mapa 9.
 */
export const spawnZonesMap9 = [
    { x: -250.62, y: -18.00, z: 191.37 },
    { x: -256.30, y: -18.00, z: 185.53 },
    { x: -256.87, y: -18.00, z: 197.43 },
    { x: -244.74, y: -18.00, z: 197.48 },
    { x: -244.37, y: -18.00, z: 185.48 },
    { x: -249.48, y: -18.00, z: 217.32 },
    { x: -265.54, y: -19.00, z: 240.49 },
    { x: -282.75, y: -19.00, z: 217.11 },
    { x: -288.30, y: -17.00, z: 189.15 },
    { x: -287.23, y: -19.00, z: 150.90 },
    { x: -267.06, y: -19.00, z: 141.12 },
    { x: -265.57, y: -18.00, z: 175.59 },
    { x: -244.37, y: -18.00, z: 185.48 }
];

/**
 * Zonas de spawn del mapa 10
 */
export const spawnZonesMap10 = [
    { x: -134.19, y: -2.00, z: 31.40 },
    { x: -130.41, y: -2.00, z: 27.43 },
    { x: -125.98, y: -2.00, z: 31.58 },
    { x: -135.13, y: -2.00, z: 31.93 },
    { x: -161.77, y: -20.00, z: 61.49 },
    { x: -168.85, y: -20.00, z: 46.75 },
    { x: -165.96, y: -20.12, z: 12.62 },
    { x: -152.28, y: -20.12, z: 1.57 },
    { x: -114.62, y: -20.00, z: 1.30 },
    { x: -105.99, y: -20.00, z: 11.85 },
    { x: -104.30, y: -17.00, z: 41.85 },
    { x: -104.43, y: -17.00, z: 64.70 },
    { x: -112.88, y: -20.00, z: 65.19 },
    { x: -132.03, y: -20.00, z: 32.46 }
];
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */