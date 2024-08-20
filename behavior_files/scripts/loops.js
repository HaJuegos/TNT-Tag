/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { inGlow, ticksConvertor } from "./items";
import { overworld } from "./main";

export let gameStart = false;
export let dataPlayers = {};

mc.system.runInterval(loopGlow => {
	try {
		if (!inGlow) return;
		overworld.getEntities({ type: 'minecraft:player', excludeTags: [ 'spect' ]}).forEach(players => {
			if (players.hasTag("player")) {
				players.triggerEvent("ha:set_glowing");
			} else if (players.hasTag("tntPlayer")) {
				players.triggerEvent("ha:remove_glowing");
			};
		});
	} catch {};
}, ticksConvertor(0.25));

mc.system.runInterval(loopNet => {
	try {
		overworld.getEntities({ type: 'minecraft:player', tags: [ 'inNet' ]}).forEach(players => {
			let randomMove = (Math.random() * 2) - 1;
			let coords = players.location;
			players.applyKnockback(coords.x, coords.z, randomMove, 0.3);
		});
	} catch {};
}, ticksConvertor(0.9));

mc.system.runInterval(checkDamage => {
	try {
		mc.world.getAllPlayers().forEach(player => {
			if (player.hasTag("player") && !player.hasTag("coinPlayer")) {
				player.triggerEvent("ha:player_damage");
			};

			if (player.hasTag("tntPlayer") && !player.hasTag("coinPlayer")) {
				player.triggerEvent("ha:tntplayer_damage");
			};

			if (player.hasTag("coinPlayer")) {
				player.triggerEvent("ha:coin_damage");
			};

			if (!player.hasTag("player") && !player.hasTag("tntPlayer") && !player.hasTag("coinPlayer")) {
				player.triggerEvent("ha:lobby_damage");
			};
		});
	} catch {};
}, ticksConvertor(1));

mc.system.runInterval(loobyTp => {
	try {
		if (gameStart) return;
		mc.world.getAllPlayers().forEach(players => {
			let coords = { x: Math.round(players.location.x), y: Math.round(players.location.y), z: Math.round(players.location.z) };
			if (coords.y <= 40) {
				if (players.hasTag("admin")) return;
				players.runCommand(`tp 2031.94 54.56 -1968.17`);
			};
		});
	} catch {};
}, ticksConvertor(0.25));

mc.system.runInterval(checkData => {
	try {
		if (gameStart) {
			mc.world.getAllPlayers().forEach(players => {
				const playerName = players.name;
				const hasPlayerTag = players.hasTag('player');
				const hasTntPlayerTag = players.hasTag('tntPlayer');
				const mapTags = ['map1', 'map2', 'map3', 'map4', 'map5', 'map6'];
				let maps = mapTags.filter(tag => players.hasTag(tag));
				const hasSpectTag = players.hasTag('spect');

				dataPlayers[playerName] = {
					hasPlayerTag: hasPlayerTag,
					hasTntPlayerTag: hasTntPlayerTag,
					maps: maps,
					hasSpectTag: hasSpectTag
				};
			});
		} else {
			dataPlayers = {};
		};
	} catch {};
}, ticksConvertor(1));

mc.system.runInterval(particleSystem => {
	try {
		overworld.getEntities({ type: 'ha:generator_entity' }).forEach(entity => {
			const variant = entity.getComponent("minecraft:variant");
			if (variant?.value == 1) {
				entity.runCommand(`particle astral:blindness_smoke ~~0.5~`);
			} else if (variant?.value == 5) {
				entity.runCommand(`particle astral:jump_boost_particle ~~0.5~`);
			} else if (variant?.value == 6) {
				entity.runCommand(`particle astral:speed_particle ~~0.5~`);
			};
		});
	} catch {};
}, ticksConvertor(1.3));

mc.system.runInterval(inGame => {
	try {
		const allPlayers = overworld.getEntities({ type: 'minecraft:player' });
		const livePlayers = allPlayers.filter(player => player.hasTag('player')).length || 0;
		const tntPlayers = allPlayers.filter(player => player.hasTag('tntPlayer')).length || 0;
		const scoreboard = mc.world.scoreboard;
		const objective = scoreboard.getObjective("totalInGame");
		const objective1 = scoreboard.getObjective("players");
		const objective2 = scoreboard.getObjective("tntPlayers");

		if (!gameStart) return;

		overworld.getEntities({ type: 'ha:sensor', tags: ["ingame"] }).forEach(entity => {
			const score = objective.getScore(entity);
			const score1 = objective1.getScore(entity);
			const score2 = objective2.getScore(entity);

			objective1.setScore(entity, livePlayers);
			objective2.setScore(entity, tntPlayers);

			if (score <= -1) {
				entity.runCommand(`function system/exploding_tnt`);
			};

			if (score1 == 0 && score2 == 0 || score1 == 0 && score2 == 1) {
				overworld.runCommand(`scriptevent ha:game_ending_draw`);
			} else if (score1 == 1 && score2 == 0) {
				overworld.runCommand(`scriptevent ha:game_ending`);
			} else if (score1 > 1 && score2 == 0) {
				entity.runCommand(`scriptevent ha:reselect_tntplayers`);
			};
		});
		
		overworld.runCommand(`scoreboard players set "score.namePlayerLive" totalAllPlayers ${livePlayers}`);
		overworld.runCommand(`scoreboard players set "score.namePlayerTnt" totalAllPlayers ${tntPlayers}`);
	} catch {};
}, ticksConvertor(1));

mc.system.afterEvents.scriptEventReceive.subscribe(staticEvents => {
	try {
		let event = staticEvents.id;
		switch (event) {
			case 'ha:game_started': {
				gameStart = true;
				hideNametags();
				startMusic(false);
			} break;
			case 'ha:game_ending': {
				returnNametags();
				stopCustomMusic(false);
				gameEnd();
			} break;
			case 'ha:game_ending_draw': {
				returnNametags();
				stopCustomMusic(false);
				gameEndDraw();
			} break;
		};
	} catch {};
});

/**
 * Detiene la musica custom a x jugador
 * @param {mc.Player} singlePlayer Jugador que le afectara esta funcion
 * @returns {Void}
 */
export function stopCustomMusic(singlePlayer) {
	if (singlePlayer) {
		singlePlayer.stopMusic();
	} else {
		mc.world.getAllPlayers().forEach(player => {
			player.stopMusic();
		});
	};
};

/**
 * Inicia la musica a x jugador. La musica es totalmente aleatoria entre `7` canciones
 * @param {mc.Player} singlePlayer Jugador al que le afectara esta funcion
 * @returns {Void}
 */
export function startMusic(singlePlayer) {
	const nameMusics = [
		"record.pandora_palace",
		"record.core",
		"record.panic",
		"record.eleventh_hour",
		"record.cyber_world",
		"record.smart_race",
		"record.dinner"
	];
	const randomIndex = Math.floor(Math.random() * nameMusics.length);
	const randomMusic = nameMusics[randomIndex];
	if (singlePlayer) {
		singlePlayer.stopMusic();
		singlePlayer.playMusic(randomMusic, { loop: true });
		singlePlayer.runCommand(`function music/${randomIndex + 2}`);
	} else {
		mc.world.getAllPlayers().forEach(player => {
			player.stopMusic();
			player.playMusic(randomMusic, { loop: true });
			player.runCommand(`function music/${randomIndex + 2}`);
		});
	};
};

/**
 * Inicia la musica lobby a x jugador
 * @param {*} singlePlayer Jugador que le afectara esta funcion
 * @returns {Void}
 */
export function startMusicLobby(singlePlayer) {
	if (singlePlayer) {
		singlePlayer.stopMusic();
		singlePlayer.playMusic("record.asobu", { loop: true });
		singlePlayer.runCommand(`function music/1`);
	} else {
		mc.world.getAllPlayers().forEach(player => {
			player.stopMusic();
			player.playMusic("record.asobu", { loop: true });
			player.runCommand(`function music/1`);
		});
	};
};

/**
 * Esconde todos los gamertags de los jugadores
 * @returns {Void}
 */
export function hideNametags() {
	mc.world.getAllPlayers().forEach(player => {
		if (player) {
			player.nameTag = "§r";
		};
	});
};

/**
 * Devuelve todos los gamertags de los jugadores
 * @returns {Void}
 */
export function returnNametags() {
	mc.world.getAllPlayers().forEach(player => {
		if (player) {
			player.nameTag = `${player.name}`;
		};
	});
};

/**
 * Termina el juego para devolver todos al lobby
 * @returns {Void}
 */
function gameEnd() {
	overworld.getEntities({ type: 'minecraft:player', tags: [ 'player' ] }).forEach(player => {
		player.runCommand(`function system/winning_game`);
		player.runCommand(`tp @a[tag=spect] @r[tag=player]`);
		mc.system.runTimeout(() => {
			gameStart = false;
			overworld.runCommand(`function system/return_lobby`);
			startMusicLobby(false);
			returnNametags();
		}, ticksConvertor(6));
	});
};

/**
 * Termina el juego pero devido a un empate, devolviendo a todos al lobby
 * @returns {Void}
 */
function gameEndDraw() {
	overworld.runCommand(`function system/drawparty`);
	mc.system.runTimeout(() => {
		gameStart = false;
		overworld.runCommand(`function system/return_lobby_draw`);
		startMusicLobby(false);
		returnNametags();
	}, ticksConvertor(6));
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */