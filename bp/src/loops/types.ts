/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Entity, Player } from "@minecraft/server";

import { glowLoop } from "./events/glowingLoop";
import { powerUpLoop } from "./events/powerUpLoop";
import { coinLoop } from "./events/coinLoop";
import { netLoop } from "./events/netLoop";
import { votationLoop } from "./events/votationLoop";
import { inGameLoop } from "./events/inGameLoop";

/**
 * Lista de eventos en loops.
 * @type {TimerLoopBase[]}
 */
export const listOfTimers: TimerLoopBase[] = [
	glowLoop,
	powerUpLoop,
	coinLoop,
	netLoop,
	votationLoop,
	inGameLoop,
];

export interface TimerLoopBase {
	obj: string;
	entities: () => Entity[] | Player[];
	onTick?: (entity: Entity | Player, score: number) => void;
	onComplete: (entity: Entity | Player) => void;
}

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */