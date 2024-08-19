/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";
import * as Gametest from "@minecraft/server-gametest";

Gametest.register("TestFakePlayers", "FakePlayers", arg => {
	let listFakePlayers = [];
	for (let i = 1; i <= 3; i++) {
		const fakePlayer = arg.spawnSimulatedPlayer({ x: 0, y: 2, z: 0}, `TestBot${i}`, mc.GameMode.survival);
		listFakePlayers.push(fakePlayer);
	};

	listFakePlayers.forEach(fPlayer => {
		fPlayer.runCommand(`tp "Ha Juegos"`);
	});
}).maxAttempts(99999)
.maxTicks(999999)
.padding(1)
.required(false)
.structureName("ha:no")
.tag("yo");
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */