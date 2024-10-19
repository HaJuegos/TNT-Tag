/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { GameMode } from "@minecraft/server";
import { register } from "@minecraft/server-gametest";

import { ticksConvertor } from "./worldStart";

register("ha:fakePlayers", "testPlayers", (Test) => {
	for (let i = 0; i < 20; i++) {
		const fakePly = Test.spawnSimulatedPlayer({ x: 0, y: 10, z: 0 }, `Bot${i}`, GameMode.adventure);

		fakePly.runCommand(`tp "ha juegos"`);
		fakePly.runCommand(`spreadplayers 2031.97 -1967.44 1.0 10 @s`);
	};
})
	.maxAttempts(99999)
	.maxTicks(ticksConvertor(99999))
	.required(false)
	.structureName("ha:no");

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */