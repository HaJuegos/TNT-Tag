/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";
import * as variables from './variables.js';
import * as ui from "@minecraft/server-ui";

const votationUi = new ui.ActionFormData()
    .title({translate: "ui.votation_time"})
    .body({translate: "ui.votation_choose"})
    .button({translate: "ui.button_random"}, "textures/ui/custom_icon/random")
    .button({translate: "ui.button_vote1"}, "textures/ui/custom_icon/map1")
    .button({translate: "ui.button_vote2"}, "textures/ui/custom_icon/map2")
    .button({translate: "ui.button_vote3"}, "textures/ui/custom_icon/map3")
    .button({translate: "ui.button_vote4"}, "textures/ui/custom_icon/map4")
    .button({translate: "ui.button_vote5"}, "textures/ui/custom_icon/map5")
    .button({translate: "ui.button_vote6"}, "textures/ui/custom_icon/map6")
    .button({translate: "ui.button_vote7"}, "textures/ui/custom_icon/map7");

export let votationTime = false;
let voteActivated = false;

let randomVote = 0;
let vote1 = 0;
let vote2 = 0;
let vote3 = 0;
let vote4 = 0;
let vote5 = 0;
let vote6 = 0;
let vote7 = 0;

mc.system.runInterval(checkAllVotations => {
	try {
		if (!voteActivated) return;
		for (const player of mc.world.getAllPlayers()) {
			let inv = player.getComponent("minecraft:inventory").container;
			let hasItem = false;
			let calculatorItem = new mc.ItemStack("ha:calculator");
			calculatorItem.lockMode = mc.ItemLockMode.inventory;
			for (let i = 0; i < inv.size; i++) {
				let item = inv.getItem(i);
				if (item && item.typeId == 'ha:calculator') {
					hasItem = true;
					break;
				} else {
					break;
				};
			};
			if (!hasItem) {
				inv.addItem(calculatorItem);
				player.sendMessage({ translate: "chat.start_voting" });
			};
		};
	} catch {};
}, 15);

mc.world.beforeEvents.chatSend.subscribe(teleportCommand => {
	try {
		let player = teleportCommand.sender;
        let message = teleportCommand.message;
		if (!player.hasTag("spect")) return;
		if (message.startsWith("!tphunter")) {
			teleportCommand.cancel = true;
			mc.system.run(() => {
				player.runCommand(`tp @r[tag=tntPlayer]`);
			});
		} else if (message.startsWith("!tpplayer")) {
			teleportCommand.cancel = true;
			mc.system.run(() => {
				player.runCommand(`tp @r[tag=player]`);
			});
		};
	} catch {};
});

mc.system.afterEvents.scriptEventReceive.subscribe(staticEvents => {
	try {
		let entity = staticEvents.sourceEntity;
		let event = staticEvents.id;
		let message = staticEvents.message;
		let dime = mc.world.getDimension('overworld');
		if (event == 'ha:starting_votation') {
			votationTime = true;
			voteActivated = true;
			dime.spawnEntity("ha:votation_timer", {x: 2031, y: 52, z: -1969});
			dime.runCommand(`scoreboard objectives setdisplay sidebar totalVotes descending`);
		} else if (event == 'ha:ending_votation') {
			dime.runCommand(`tag @a remove voted`);
			gameStarted();
		} else if (event == 'ha:voting') {
			showUiVotations(votationUi, entity);
		};
	} catch {};
});

function showUiVotations(votationUi, player) {
	votationUi.show(player).then(response => {
		if (response.canceled || player.hasTag("voted")) return;
		let messageChat;
		switch (response.selection) {
			case 0: {
				messageChat = {translate: "chat.random"};
				randomVote += 1;
				addScoreVote(player, 0);
			} break;
			case 1: {
				messageChat = {translate: "chat.voted1"};
				vote1 += 1;
				addScoreVote(player, 1);
			} break;
			case 2: {
				messageChat = {translate: "chat.voted2"};
				vote2 += 1;
				addScoreVote(player, 2);
			} break;
			case 3: {
				messageChat = {translate: "chat.voted3"};
				vote3 += 1;
				addScoreVote(player, 3);
			} break;
			case 4: {
				messageChat = {translate: "chat.voted4"};
				vote4 += 1;
				addScoreVote(player, 4);
			} break;
			case 5: {
				messageChat = {translate: "chat.voted5"};
				vote5 += 1;
				addScoreVote(player, 5);
			} break;
			case 6: {
				messageChat = {translate: "chat.voted6"};
				vote6 += 1;
				addScoreVote(player, 6);
			} break;
			case 7: {
				messageChat = {translate: "chat.voted7"};
				vote7 += 1;
				addScoreVote(player, 7);
			} break;
		};
		mc.system.run(() => {
			player.sendMessage(messageChat);
			player.addTag("voted");
			player.playSound("random.levelup");
		});
	});
};

function addScoreVote(player, num) {
	mc.system.run(() => {
		if (num == 0) {
			let scoreboardName = `score.random`;
            player.runCommand(`scoreboard players add "${scoreboardName}" totalVotes 1`);
		} else if (num >= 1 && num <= 7) {
            let scoreboardName = `score.map${num}`;
            player.runCommand(`scoreboard players add "${scoreboardName}" totalVotes 1`);
        }
    });
};

function getTntPlayer(over) {
    let players = mc.world.getAllPlayers();
    let totalPlayersNeeded;
    if (players.length >= 2 && players.length <= 3) {
        totalPlayersNeeded = 1;
    } else if (players.length >= 4 && players.length <= 5) {
        totalPlayersNeeded = 2;
    } else if ((players.length == 6 || players.length >= 8) && players.length <= 9) {
        totalPlayersNeeded = 3;
    } else if (players.length == 7 || players.length >= 10) {
        totalPlayersNeeded = 4;
    };
    players = players.sort(() => Math.random() - 0.5);
    let selectedPlayers = players.slice(0, totalPlayersNeeded);
    return selectedPlayers;
};

function gameStarted() {
	let over = mc.world.getDimension('overworld');
	let message;
	let map = 0;
    let votes = [randomVote, vote1, vote2, vote3, vote4, vote5, vote6, vote7];
    let maxVote = Math.max(...votes);
    let maxIndices = votes.reduce((acc, vote, index) => {
        if (vote == maxVote) acc.push(index);
        return acc;
    }, []);
    if (randomVote >= maxVote) {
        map = Math.floor(Math.random() * 7) + 1;
        message = {translate: "chat.random_map_win", with: {rawtext:[{text: `${map}`}]}};
    } else if (maxIndices.length == 1) {
        map = maxIndices[0];
        message = {translate: "chat.mapWinnning", with: {rawtext:[{text: `${map}`}, {text: `${maxVote}`}]}};
    } else {
        map = maxIndices[Math.floor(Math.random() * maxIndices.length)];
        message = {translate: "chat.map_equals", with: {rawtext: [{text: `${map}`}]}};
    };
	voteActivated = false;
    mc.world.sendMessage(message);
    mc.system.runTimeout(timeOut => {
		over.runCommand(`execute as @a at @s run camera @s fade time 1 5 0.5 color 0 0 0`);
		over.runCommand(`execute as @a at @s run playsound portal.travel`);
		over.runCommand(`clear @a`);
		over.runCommand(`scoreboard objectives setdisplay sidebar winStack descending`);
		mc.system.runTimeout(() => {
			for (let players of mc.world.getAllPlayers()) {
				if (players) {
					let totalSpawnZones;
					switch (map) {
						case 1: { totalSpawnZones = variables.spawnZonesMap1; } break;
						case 2: { totalSpawnZones = variables.spawnZonesMap2; } break;
						case 3: { totalSpawnZones = variables.spawnZonesMap3; } break;
						case 4: { totalSpawnZones = variables.spawnZonesMap4; } break;
						case 5: { totalSpawnZones = variables.spawnZonesMap5; } break;
						case 6: { totalSpawnZones = variables.spawnZonesMap6; } break;
						case 7: { totalSpawnZones = variables.spawnZonesMap7; } break;
					};
					let randomIndex = Math.floor(Math.random() * totalSpawnZones.length);
					let randomSpawnZone = totalSpawnZones[randomIndex];
					players.tryTeleport(randomSpawnZone, { dimension: over });
					players.addTag(`map${map}`);
					if (map == 7) {
						players.addEffect("night_vision", 199980, { amplifier: 100, showParticles: false });
					};
				};
			};
			
			let tntPlayers = getTntPlayer(over);
			for (let tntPlayer of tntPlayers) {
				if (tntPlayer) {
					tntPlayer.addTag("tntPlayer");
					tntPlayer.triggerEvent("ha:give_tnt");
				};
			};
			
			let normalPlayers = over.getEntities({ type: 'minecraft:player', excludeTags: [ 'admin', 'spect', 'tntPlayer' ] });
			for (let player of normalPlayers) {
				if (player) {
					player.addTag("player");
					player.triggerEvent("ha:receive_tnt");
				};
			};
			
			for (const entity of over.getEntities({type: 'ha:sensor'})) {
				entity.addTag("ingame");
				entity.runCommand(`scoreboard players set @s totalInGame 55`);
				entity.runCommand(`scoreboard objectives setdisplay sidebar totalAllPlayers descending`);
				entity.runCommand(`scriptevent ha:game_started`);
			};
			
			randomVote = 0;
			vote1 = 0;
			vote2 = 0;
			vote3 = 0;
			vote4 = 0;
			vote5 = 0;
			vote6 = 0;
			vote7 = 0;
			votationTime = false;
		}, 100);
    }, 100);
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */