/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

export let gameStart = false;

export let dataPlayers = {};

mc.system.runInterval(loobyTp => {
	try {
		if (gameStart) return;
		for (const players of mc.world.getAllPlayers()) {
			let coords = { x: Math.round(players.location.x), y: Math.round(players.location.y), z: Math.round(players.location.z) };
			if (coords.y <= 40) {
				if (players.hasTag("admin")) return;
				players.runCommand(`tp 2031.94 54.56 -1968.17`);
			};
		};
	} catch {};
}, 5);

mc.system.runInterval(checkData => {
	try {
		if (gameStart) {
			for (const players of mc.world.getAllPlayers()) {
				let playerName = players.name;
				let hasPlayerTag = players.hasTag('player');
				let hasTntPlayerTag = players.hasTag('tntPlayer');
				let mapTags = ['map1', 'map2', 'map3', 'map4', 'map5', 'map6'];
				let maps = mapTags.filter(tag => players.hasTag(tag));
				let hasSpectTag = players.hasTag('spect');
				dataPlayers[playerName] = {
					hasPlayerTag: hasPlayerTag,
					hasTntPlayerTag: hasTntPlayerTag,
					maps: maps,
					hasSpectTag: hasSpectTag
				};
			};
		} else {
			dataPlayers = {};
		};
	} catch {};
}, 20);

mc.system.runInterval(particleSystem => {
	try {
		let dime = mc.world.getDimension('overworld');
		for (const entity of dime.getEntities({ type: 'ha:generator_entity' })) {
			let variant = entity.getComponent("minecraft:variant");
			if (variant.value == 1) {
				entity.runCommand(`particle astral:blindness_smoke ~~0.5~`);
			} else if (variant.value == 5) {
				entity.runCommand(`particle astral:jump_boost_particle ~~0.5~`);
			} else if (variant.value == 6) {
				entity.runCommand(`particle astral:speed_particle ~~0.5~`);
			};
		};
	} catch {};
}, 26);

mc.system.runInterval(inGame => {
	try {
		let dime = mc.world.getDimension('overworld');
		let allPlayers = dime.getEntities({ type: 'minecraft:player' });
		let livePlayers = allPlayers.filter(player => player.hasTag('player')).length || 0;
		let tntPlayers = allPlayers.filter(player => player.hasTag('tntPlayer')).length || 0;
		let scoreboard = mc.world.scoreboard;
		let objective = scoreboard.getObjective("totalInGame");
		let objective1 = scoreboard.getObjective("players");
		let objective2 = scoreboard.getObjective("tntPlayers");
		if (!gameStart) return;
		for (const entity of dime.getEntities({ type: 'ha:sensor', tags: ["ingame"] })) {
			let score = objective.getScore(entity);
			let score1 = objective1.getScore(entity);
			let score2 = objective2.getScore(entity);
			objective1.setScore(entity, livePlayers);
			objective2.setScore(entity, tntPlayers);
			if (score <= -1) {
				entity.runCommand(`function system/exploding_tnt`);
			};
			if (score1 == 0 && score2 == 0 || score1 == 0 && score2 == 1) {
				dime.runCommand(`scriptevent ha:game_ending_draw`);
			} else if (score1 == 1 && score2 == 0) {
				dime.runCommand(`scriptevent ha:game_ending`);
			} else if (score1 > 1 && score2 == 0) {
				entity.runCommand(`scriptevent ha:reselect_tntplayers`);
			};
		};
		
		dime.runCommand(`scoreboard players set "score.namePlayerLive" totalAllPlayers ${livePlayers}`);
		dime.runCommand(`scoreboard players set "score.namePlayerTnt" totalAllPlayers ${tntPlayers}`);
	} catch {};
}, 20);

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
				stopMusic(false);
				gameEnd();
			} break;
			case 'ha:game_ending_draw': {
				returnNametags();
				stopMusic(false);
				gameEndDraw();
			} break;
		};
	} catch {};
});

export function stopMusic(singlePlayer) {
	if (singlePlayer) {
		player.stopMusic();
	} else {
		for (const player of mc.world.getAllPlayers()) {
			player.stopMusic();
		};
	};
};

export function startMusic(singlePlayer) {
	const nameMusics = [
		"record.pandora_palace",
		"record.core",
		"record.panic",
		"record.eleventh_hour",
		"record.cyber_world",
		"record.smart_race"
	];
	const randomIndex = Math.floor(Math.random() * nameMusics.length);
	const randomMusic = nameMusics[randomIndex];
	if (singlePlayer) {
		singlePlayer.stopMusic();
		singlePlayer.playMusic(randomMusic, { loop: true });
		singlePlayer.runCommand(`function music/${randomIndex + 2}`);
	} else {
		for (const player of mc.world.getAllPlayers()) {
			player.stopMusic();
			player.playMusic(randomMusic, { loop: true });
			player.runCommand(`function music/${randomIndex + 2}`);
		};	
	};
};

export function startMusicLobby(singlePlayer) {
	if (singlePlayer) {
		singlePlayer.stopMusic();
		singlePlayer.playMusic("record.asobu", { loop: true });
		singlePlayer.runCommand(`function music/1`);
	} else {
		for (const player of mc.world.getAllPlayers()) {
			player.stopMusic();
			player.playMusic("record.asobu", { loop: true });
			player.runCommand(`function music/1`);
		};
	};
};

export function hideNametags() {
	for (const player of mc.world.getAllPlayers()) {
		player.nametag = "";
	};
};

export function returnNametags() {
	for (const player of mc.world.getAllPlayers()) {
		player.nametag = `${player.name}`;
	};
};

function gameEnd() {
	let dime = mc.world.getDimension('overworld');
	for (const player of dime.getEntities({ type: 'minecraft:player', tags: [ 'player' ] })) {
		player.runCommand(`function system/winning_game`);
		player.runCommand(`tp @a[tag=spect] @r[tag=player]`);
		mc.system.runTimeout(() => {
			gameStart = false;
			dime.runCommand(`function system/return_lobby`);
			startMusicLobby(false);
			for (const player of mc.world.getAllPlayers()) {
				player.nametag = `${player.name}`;
			};
		}, 120);
	};
};

function gameEndDraw() {
	let dime = mc.world.getDimension('overworld');
	dime.runCommand(`function system/drawparty`);
	mc.system.runTimeout(() => {
		gameStart = false;
		dime.runCommand(`function system/return_lobby_draw`);
		startMusicLobby(false);
		returnNametags();
	}, 120);
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */