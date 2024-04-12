/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";
import * as Gametest from "@minecraft/server-gametest";

Gametest.register("testplayers", "players", (test) => {
	const dimension = mc.world.getDimension("overworld");
	const listPlayers = [];
	for (let i = 1; i <= 3; i++) {
		const fakePlayer = test.spawnSimulatedPlayer({ x: 0, y: 2, z: 0 }, `TestBot${i}`, 0);
		listPlayers.push(fakePlayer);
	};
	for (const fakePlayer of listPlayers) {
		fakePlayer.runCommand(`tp "ha juegos"`);
	};
	mc.system.afterEvents.scriptEventReceive.subscribe(testEvents => {
		let entity = testEvents.sourceEntity;
		let message = testEvents.message;
		let dime = mc.world.getDimension('overworld');
		if (testEvents.id == 'ha:desconect') {
			for (const fakePlayer of listPlayers) {
				fakePlayer.disconnect();
			};
		};
	});
})
	.maxAttempts(99999)
	.maxTicks(999999)
	.padding(1)
	.required(false)
	.structureName("ha:no")
	.tag("yo");
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */