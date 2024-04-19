/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";
import * as debug from "@minecraft/debug-utilities";
import * as variables from './variables.js';
import * as commands from './customCommands.js';
import * as loops from './loops.js';
import './adminStaff.js';
// import './testplayers.js';

let inGlow = false;
let elytraTime = {};
let allCoords = {};

debug.disableWatchdog(true);

mc.system.runInterval(loopGlow => {
	try {
		if (!inGlow) return;
		for (const players of mc.world.getDimension("overworld").getEntities({ type: 'minecraft:player', excludeTags: [ 'spect' ]})) {
			if (players.hasTag("player")) {
				players.triggerEvent("ha:set_glowing");
			} else if (players.hasTag("tntPlayer")) {
				players.triggerEvent("ha:remove_glowing");
			};
		};
	} catch {};
}, 5);

mc.system.runInterval(loopNet => {
	try {
		for (const players of mc.world.getDimension("overworld").getEntities({ type: 'minecraft:player', tags: [ 'inNet' ]})) {
			let randomMove = (Math.random() * 2) - 1;
			let coords = players.location;
			players.applyKnockback(coords.x, coords.z, randomMove, 0.3);
		};
	} catch {};
}, 18);

mc.world.afterEvents.worldInitialize.subscribe(setupWorld => {
	try {
		for (let command of variables.listOfCommands) {
			mc.world.getDimension('overworld').runCommand(`${command}`);
		};
	} catch {};
});

mc.world.afterEvents.playerSpawn.subscribe(playerSpawned => {
	try {
		let player = playerSpawned.player;
		checkLastConnection(player);
	} catch {};
});

mc.world.afterEvents.itemUse.subscribe(itemUsed => {
	try {
		let source = itemUsed.source;
		let tntItem = new mc.ItemStack("ha:tnt_item_hand");
		let item = itemUsed.itemStack;
		let tntCooldown = tntItem.getComponent("minecraft:cooldown");
		if (item.typeId == 'ha:tnt_item_hand' && tntCooldown.getCooldownTicksRemaining(source) == 0) {
			for (const players of mc.world.getAllPlayers()) {
				tntCooldown.startCooldown(players);
			};
		} else if (item.typeId == 'minecraft:firework_rocket') {
			let inv = source.getComponent("minecraft:inventory").container;
			let armorInv = source.getComponent("minecraft:equippable");
			let itemChest = armorInv.getEquipment("Chest");
			if (itemChest.typeId == 'minecraft:elytra') {
				let playerName = source.name;
				if (!elytraTime[playerName]) {
					elytraTime[playerName] = 1;
				} else {
					if (elytraTime[playerName] < 1) {
						elytraTime[playerName]++;
					} else {
						source.playSound("random.break");
						armorInv.setEquipment("Chest", null);
						for (let i = 0; i < inv.size; i++) {
							let item = inv.getItem(i);
							if (item && item.typeId == 'minecraft:elytra') {
								inv.setItem(i, null);
								break;
							};
						};
						delete elytraTime[playerName];
					};
				}
			};
		};
	} catch {};
});

mc.world.afterEvents.projectileHitBlock.subscribe(arrowSensorBlock => {
	try {
		let projectile = arrowSensorBlock.projectile;
		let source = arrowSensorBlock.source;
		if (projectile.typeId == 'minecraft:snowball') {
			let variant = projectile.getComponent("minecraft:variant");
			if (variant.value == 1) {
				if (!source.hasTag("tntPlayer")) {
					projectile.remove();
				} else {
					mc.system.runTimeout(() => {
						if (source.hasTag("tntPlayer")) {
							source.sendMessage({ translate: "chat.error_nohittnt" });
							source.playSound("ui.error_blocked");
							source.runCommand(`scriptevent ha:tnt_staff`);
							projectile.remove();
						} else {
							projectile.remove();
						};
					}, 40);
				};
			};
		};
	} catch {};
});

mc.world.afterEvents.projectileHitEntity.subscribe(arrowSensorEntity => {
	try {
		let projectile = arrowSensorEntity.projectile;
		let source = arrowSensorEntity.source;
		let hitEntity = arrowSensorEntity.getEntityHit().entity;
		if (projectile.typeId == 'minecraft:snowball') {
			let variant = projectile.getComponent("minecraft:variant");
			if (variant.value == 1) {
				if (source.hasTag("tntPlayer") && hitEntity.hasTag("player")) {
					projectile.remove();
				} else {
					mc.system.runTimeout(() => {
						if (source.hasTag("tntPlayer")) {
							source.sendMessage({ translate: "chat.error_nohittnt" });
							source.playSound("ui.error_blocked");
							source.runCommand(`scriptevent ha:tnt_staff`);
							projectile.remove();
						} else {
							projectile.remove();
						};
					}, 40);
				};
			} else if (variant.value == 2 && hitEntity.typeId == 'minecraft:player') {
				if (hitEntity.hasTag("inNet")) return;
				let coords = hitEntity.location;
				hitEntity.runCommand(`playsound ui.netgun.hit @a ~~~`);
				hitEntity.runCommand(`playsound player.hitnet @a ~~~`);
				hitEntity.triggerEvent("ha:in_net");
				projectile.remove();
			};
		};
	} catch {};
});

mc.world.afterEvents.entityHurt.subscribe(damageSensor => {
	try {
		let hurtEntity = damageSensor.hurtEntity;
		let source = damageSensor.damageSource;
		let damagingEntity = source.damagingEntity;
		let cause = source.cause;
		if (hurtEntity.typeId == 'minecraft:player' && damagingEntity.typeId == 'minecraft:player') {
			if (cause == 'projectile') {
				damagingEntity.playSound("player.bow_hit");
			};
			if (damagingEntity.hasTag("tntPlayer")) {
				hurtEntity.triggerEvent("ha:give_tnt");
				damagingEntity.triggerEvent("ha:receive_tnt");
			};
		};
	} catch {};
});

mc.world.afterEvents.playerInteractWithEntity.subscribe(interactSensor => {
	try {
		let entity = interactSensor.target;
		let player = interactSensor.player;
		if (entity.typeId == 'ha:generator_entity') {
			checkVariant(player, entity);
		};
	} catch {};
});

mc.world.beforeEvents.playerInteractWithBlock.subscribe(blockSensor => {
	try {
		let player = blockSensor.player;
		let block = blockSensor.block;
		if (commands.votationTime || loops.gameStart) return;
		if (block.typeId == 'minecraft:stone_button') {
			let coords = { x: Math.round(block.location.x), y: Math.round(block.location.y), z: Math.round(block.location.z) };
			if (coords.x == 2035 && coords.y == 53 && coords.z == -1977) {
				mc.system.run(() => {
					player.runCommand(`scriptevent ha:check_players`);
				});
			};
		} else if (block.typeId == 'minecraft:warped_button') {
			let coords = { x: Math.round(block.location.x), y: Math.round(block.location.y), z: Math.round(block.location.z) };
			if (coords.x == 1947 && coords.y == 61 && coords.z == -2008) {
				mc.system.run(() => {
					player.runCommand(`function regaloomaga`);
				});
			};
		};
	} catch {};
});

mc.world.afterEvents.entityHitEntity.subscribe(hitSensor => {
	try {
		let meleeEntity = hitSensor.damagingEntity;
		let damageEntity = hitSensor.hitEntity;
		if (meleeEntity.typeId == 'minecraft:player') {
			if (meleeEntity.hasTag("tntPlayer") && damageEntity.typeId == 'minecraft:player' && damageEntity.hasTag("player") && !damageEntity.hasTag("coinCooldown")) {
				damageEntity.triggerEvent("ha:give_tnt");
				meleeEntity.triggerEvent("ha:receive_tnt");
				
				if (damageEntity.hasTag("glow")) {
					damageEntity.triggerEvent("ha:remove_glowing");
					meleeEntity.triggerEvent("ha:set_glowing");
				} else if (meleeEntity.hasTag("glow")) {
					meleeEntity.triggerEvent("ha:remove_glowing");
					damageEntity.triggerEvent("ha:set_glowing");
				};
			} else if (damageEntity.typeId == 'ha:generator_entity') {
				checkVariant(meleeEntity, damageEntity);
			};
		};
	} catch {};
});

mc.system.afterEvents.scriptEventReceive.subscribe(staticEvents => {
	try {
		let entity = staticEvents.sourceEntity;
		let message = staticEvents.message;
		let dime = mc.world.getDimension('overworld');
		switch (staticEvents.id) {
			case 'ha:check_players': {
				let players = mc.world.getPlayers();
				let message;
				if (players.length > 1) {
					message = {translate: "chat.gameStarted", with: {rawtext: [{text: `${players.length}`}]}};
					mc.world.sendMessage(message);
					dime.runCommand(`execute as @a at @s run playsound random.levelup`);
					dime.runCommand(`scriptevent ha:starting_votation`);
				} else {
					message = {translate: "chat.error_noplayers"};
					mc.world.sendMessage(message);
					dime.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				};
			} break;
			case 'ha:reselect_tntplayers': {
				const players = dime.getEntities({ type: 'minecraft:player', tags: ['player'] });
				let allPlayers = dime.getEntities({ type: 'minecraft:player' });
				let scoreboard = mc.world.scoreboard;
				let objective1 = scoreboard.getObjective("players");
				let objective2 = scoreboard.getObjective("tntPlayers");
				let livePlayers = allPlayers.filter(player => player.hasTag('player')).length || 0;
				let tntPlayers = allPlayers.filter(player => player.hasTag('tntPlayer')).length || 0;
				for (const entity of dime.getEntities({ type: 'ha:sensor' })) {
					let score1 = objective1.getScore(entity);
					objective1.setScore(entity, livePlayers);
					let tntPlayersSelected;
					if (score1 >= 1 && score1 <= 3) {
						tntPlayersSelected = 1;
					} else if (score1 >= 4 && score1 <= 5) {
						tntPlayersSelected = 2;
					} else if ((score1 == 6 || score1 >= 8) && score1 <= 9) {
						tntPlayersSelected = 3;
					} else if (score1 == 7 || score1 >= 10) {
						tntPlayersSelected = 4;
					};
					objective2.setScore(entity, tntPlayersSelected);
					for (let i = 0; i < tntPlayersSelected; i++) {
						const randomIndex = Math.floor(Math.random() * players.length);
						const player = players[randomIndex];
						player.triggerEvent("ha:give_tnt");
					};
				};
			} break;
			case 'ha:used_compass': {
				let message;
				message = {translate: "chat.compass_activated"};
				mc.world.sendMessage(message);
				inGlow = true;
				dime.runCommand(`time set midnight`);
				dime.runCommand(`execute as @a at @s run playsound ui.used_compass`);
				loops.returnNametags();
				setCooldown();
				mc.system.runTimeout(() => {
					if (inGlow) {
						message = {translate: "chat.compass_deactivated"};
						mc.world.sendMessage(message);
						inGlow = false;
						dime.runCommand(`event entity @a[tag=!spect] ha:remove_glowing`);
						dime.runCommand(`time set day`);
						dime.runCommand(`execute as @a at @s run playsound mob.zombie.unfect`);
						loops.hideNametags();
					};
				}, 500);
			} break;
			case 'ha:used_coin': {
				let armorInv = entity.getComponent("minecraft:equippable");
				let inv = entity.getComponent("minecraft:inventory").container;
				let item = armorInv.getEquipment("Chest");
				let newItem = new mc.ItemStack("minecraft:netherite_chestplate");
				let recoveryItem = new mc.ItemStack("minecraft:elytra");
				newItem.lockMode = mc.ItemLockMode.slot;
				let message;
				if (entity.hasTag("tntPlayer")) {
					message = {translate: "chat.no_coin_activate"};
					entity.sendMessage(message);
					entity.playSound("ui.error_blocked");
					entity.runCommand(`give @s ha:coin_item 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}`);
				} else if (entity.hasTag("coinCooldown")) {
					message = {translate: "chat.coin_cooldown"};
					entity.sendMessage(message);
					entity.playSound("ui.error_blocked");
				} else {
					message = {translate: "chat.activate_coin"};
					entity.sendMessage(message);
					entity.playSound("ui.used_coin");
					entity.addTag("coinCooldown");
					entity.addTag("cooldownBuff");
					entity.triggerEvent("ha:coin_damage");
					entity.nameTag = `§e§l[COIN ACTIVATED]§r\n${entity.name}`;
					if (item && item.typeId == 'minecraft:elytra') {
						inv.addItem(recoveryItem);
						armorInv.setEquipment("Chest", newItem);
					} else {
						armorInv.setEquipment("Chest", newItem);
					};
					mc.system.runTimeout(() => {
						message = {translate: "chat.removed_coin"};
						entity.sendMessage(message);
						entity.playSound("mob.zombie.unfect");
						entity.removeTag("coinCooldown");
						entity.removeTag("cooldownBuff");
						entity.runCommand(`clear @s netherite_chestplate`);
						entity.triggerEvent("ha:return_normal_damage");
						if (inGlow) {
							entity.nameTag = `${entity.name}`;	
						} else {
							entity.nameTag = "";
						};
					}, 160);
				};
			} break;
			case 'ha:set_lore': {
				let inv = entity.getComponent("minecraft:inventory").container;
				let newItem = new mc.ItemStack("ha:coin_item");
				for (let i = 0; i < inv.size; i++) {
					let item = inv.getItem(i);
					if (!item) continue;
					if (item.typeId == 'ha:coin_item' && item.getLore().length == 0) {
						newItem.setLore(["§bEste item te protejera de los jugadores con TNT", "", "§bThis item will protect you from TNT players"]);
						inv.setItem(i, newItem);
					};
				};
			} break;
			case 'ha:used_wing': {
				let coords = entity.location;
				entity.applyKnockback(coords.z, coords.x, 0.1, 1.5);
				entity.runCommand(`particle minecraft:knockback_roar_particle ~~0.5~`);
				entity.playSound("mob.enderdragon.flap");
			} break;
			case 'ha:set_lore_two': {
				let inv = entity.getComponent("minecraft:inventory").container;
				let newItem = new mc.ItemStack("ha:wing_item");
				for (let i = 0; i < inv.size; i++) {
					let item = inv.getItem(i);
					if (!item) continue;
					if (item.typeId == 'ha:wing_item' && item.getLore().length == 0) {
						newItem.setLore(["§bEste item te lanzara por lo mas alto", "", "§bThis item will launch you over the top"]);
						inv.setItem(i, newItem);
					};
				};
			} break;
			case 'ha:tnt_staff': {
				let newItem1 = new mc.ItemStack("ha:tnt_helmet");
				let newItem2 = new mc.ItemStack("ha:tnt_item_hand");
				let newItem3 = new mc.ItemStack("ha:super_compass");
				let newItem4 = new mc.ItemStack("ha:rolling_players");
				let inv = entity.getComponent("minecraft:inventory").container;
				let invArmor = entity.getComponent("minecraft:equippable");
				newItem1.lockMode = mc.ItemLockMode.slot;
				newItem2.lockMode = mc.ItemLockMode.inventory;
				newItem3.lockMode = mc.ItemLockMode.inventory;
				newItem4.lockMode = mc.ItemLockMode.inventory;
				invArmor.setEquipment("Head", newItem1);
				let hasItem2 = false;
				let hasItem3 = false;
				let hasItem4 = false;
				for (let i = 0; i < inv.size; i++) {
					let item = inv.getItem(i);
					if (item && item.typeId == newItem2.typeId) {
						hasItem2 = true;
					};
					if (item && item.typeId == newItem3.typeId) {
						hasItem3 = true;
					};
					if (item && item.typeId == newItem4.typeId) {
						hasItem4 = true;
					};
				};
				if (!hasItem2) {
					inv.addItem(newItem2);
				};
				if (!hasItem3) {
					inv.addItem(newItem3);
				};
				if (!hasItem4) {
					inv.addItem(newItem4);
				};
			} break;
			case 'ha:teleport_players_tnt': {
				for (const players of dime.getEntities({ type: 'minecraft:player', tags: [ 'player' ]})) {
					allCoords[players.name] = { location: players.location, viewDirection: players.getViewDirection() };
				};
				for (const tntPlayers of dime.getEntities({ type: 'minecraft:player', tags: [ 'tntPlayer' ]})) {
					allCoords[tntPlayers.name] = { location: tntPlayers.location, viewDirection: tntPlayers.getViewDirection() };
				};
				for (const player of dime.getEntities({ type: 'minecraft:player', excludeTags: [ 'spect' ] })) {
					let randomPlayer = getRandomPlayer(player.name);
					let randomCoords = randomPlayer.location;
					let viewDirection = randomPlayer.viewDirection;
					player.tryTeleport(randomCoords, { dimension: dime, facingLocation: viewDirection });
				};
				mc.world.sendMessage({ translate: "chat.rolling_players" });
				dime.runCommand(`execute as @a at @s run playsound ui.rolling_players`);
				let itemCooldown = new mc.ItemStack("ha:rolling_players");
				let cooldown = itemCooldown.getComponent("minecraft:cooldown");
				for (const players of mc.world.getAllPlayers()) {
					cooldown.startCooldown(players);
				};
				allCoords = {};
			} break;
			case 'ha:end_game_name': {
				loops.returnNametags();
				if (inGlow) {
					message = {translate: "chat.compass_deactivated"};
					mc.world.sendMessage(message);
					inGlow = false;
					dime.runCommand(`event entity @a[tag=!spect] ha:remove_glowing`);
					dime.runCommand(`time set day`);
					dime.runCommand(`execute as @a at @s run playsound mob.zombie.unfect`);
				};
			} break;
			case 'ha:in_net': {
				entity.runCommand(`inputpermission set @s movement disabled`);
				entity.runCommand(`camera @s set minecraft:third_person`);
				entity.addTag("inNet");
				mc.system.runTimeout(() => {
					entity.runCommand(`inputpermission set @s movement enabled`);
					entity.runCommand(`camera @s clear`);
					entity.removeTag("inNet");
					entity.triggerEvent("ha:remove_in_net");
					entity.runCommand(`particle minecraft:knockback_roar_particle ~~0.5~`);
				}, 130);
			} break;
		};
	} catch {};
});

function getRandomPlayer(currentPlayerName) {
    let playerNames = Object.keys(allCoords);
    let randomPlayerName;
    do {
        randomPlayerName = playerNames[Math.floor(Math.random() * playerNames.length)];
    } while (randomPlayerName.replace(/\W/g, '') == currentPlayerName.replace(/\W/g, ''));
    return allCoords[randomPlayerName];
};

function checkLastConnection(player) {
    player.addEffect("saturation", 999999, { amplifier: 100, showParticles: false });
    player.runCommand(`hud @s hide health`);
    player.runCommand(`hud @s hide hunger`);
    player.runCommand(`hud @s hide armor`);
    player.runCommand(`hud @s hide air_bubbles`);
	if (loops.gameStart) {
		let getData = loops.dataPlayers[player.name];
		if (getData) {
			let searchActualMap = getData.maps;
			if (getData.hasPlayerTag || getData.hasTntPlayerTag && searchActualMap && searchActualMap.length > 0) {
				let mapCounts = {};
				let maxCount = 0;
				let mostCommonMap = null;
				for (const playerName in loops.dataPlayers) {
					let playerData = loops.dataPlayers[playerName];
					let maps = playerData.maps;
					if (maps && maps.length > 0) {
						for (const map of maps) {
							mapCounts[map] = (mapCounts[map] || 0) + 1;
							if (mapCounts[map] > maxCount) {
								maxCount = mapCounts[map];
								mostCommonMap = map;
							};
						};
					};
				};
				if (searchActualMap.includes(mostCommonMap)) {
					let spawnZones;
					const mapSpawnZones = {
						map1: variables.spawnZonesMap1,
						map2: variables.spawnZonesMap2,
						map3: variables.spawnZonesMap3,
						map4: variables.spawnZonesMap4,
						map5: variables.spawnZonesMap5,
						map6: variables.spawnZonesMap6
					};
					spawnZones = mapSpawnZones[searchActualMap];
					let randomIndex = Math.floor(Math.random() * spawnZones.length);
					let randomSpawnZone = spawnZones[randomIndex];
					player.tryTeleport(randomSpawnZone, { dimension: player.dimension });
					player.removeTag(`${searchActualMap}`);
					player.addTag(`${mostCommonMap}`);
					loops.startMusic(player);
					let message = {translate: "chat.return_game"};
					player.sendMessage(message);
					if (!inGlow) {
						player.triggerEvent("ha:remove_glowing");
						player.nameTag = "";
					};
				};
			};
		} else {
			loops.startMusic(player);
			if (player.hasTag("spect")) {
				let message = {translate: "chat.return_ingame"};
				player.sendMessage(message);
				player.runCommand(`tp @r[tag=player]`);
			} else {
				player.runCommand(`function system/now_spectator`)
			};
		};
	} else {
		if (player.hasTag("spect")) {
			player.runCommand(`function system/player_return_lobby`);
			loops.startMusicLobby(player);
		} else if (player.hasTag("tntPlayer") || player.hasTag("player")) {
			player.runCommand(`function system/player_return_lobby`)
			loops.startMusicLobby(player);
		} else {
			loops.startMusicLobby(player);
		};
	};
};

function setCooldown() {
	let item = new mc.ItemStack("ha:super_compass");
	let cooldown = item.getComponent("minecraft:cooldown");
	for (const players of mc.world.getAllPlayers()) {
		cooldown.startCooldown(players);
	};
};

function checkVariant(player, sensor) {
    if (player.hasTag("cooldownBuff")) {
        let message = { translate: "chat.cooldown_debuff" };
        player.playSound("ui.error_blocked");
        player.sendMessage(message);
        return;
    };
	let dimension = player.dimension;
    let variant = sensor.getComponent('minecraft:variant');
	switch (variant.value) {
		case 1: {
			if (player.hasTag("player")) {
				mc.world.sendMessage({ translate: "chat.debuff_blidness" });
				dimension.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				for (const tntPlayers of dimension.getEntities({ type: 'minecraft:player', tags: [ "tntPlayer" ] })) {
					tntPlayers.addEffect("blindness", 100, { amplifier: 0, showParticles: true });
				};
				setCooldownBoost(player, sensor);
			} else if (player.hasTag("tntPlayer")) {
				mc.world.sendMessage({ translate: "chat.debuff_blindness_tnt" });
				dimension.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				for (const players of dimension.getEntities({ type: 'minecraft:player', tags: [ "player" ] })) {
					players.addEffect("blindness", 100, { amplifier: 0, showParticles: true });
				};
				setCooldownBoost(player, sensor);	
			};
		} break;
		case 2: {
			let inv = player.getComponent("minecraft:inventory").container;
			let item1 = new mc.ItemStack("minecraft:bow");
			let item2 = new mc.ItemStack("minecraft:arrow", 3);
			item1.lockMode = mc.ItemLockMode.inventory;
			item2.lockMode = mc.ItemLockMode.inventory;
			inv.addItem(item1);
			inv.addItem(item2);
			setCooldownBoost(player, sensor);
		} break;
		case 3: {
			if (player.hasTag("player")) {
				let inv = player.getComponent("minecraft:inventory").container;
				let item1 = new mc.ItemStack("ha:coin_item");
				item1.lockMode = mc.ItemLockMode.inventory;
				item1.setLore(["§bEste item te protege de la TNT.", "", "§bThis item protects you from TNT."]);
				inv.addItem(item1);
				setCooldownBoost(player, sensor);
			} else if (player.hasTag("tntPlayer")) {
				player.sendMessage({ translate: "chat.no_coin_activate" });
				player.playSound("ui.error_blocked");
				return;
			};
		} break;
		case 4: {
			if (player.hasTag("player")) {
				if (!inGlow) {
					player.addEffect("invisibility", 200, { amplifier: 0, showParticles: true });
					setCooldownBoost(player, sensor);
				} else {
					player.sendMessage({ translate: "chat.cooldown_debuff" });
					player.playSound("ui.error_blocked");
					return;
				};
			} else if (player.hasTag("tntPlayer")) {
				player.sendMessage({ translate: "chat.no_coin_activate" });
				player.playSound("ui.error_blocked");
				return;
			};
		} break;
		case 5: {
			player.addEffect("jump_boost", 200, { amplifier: 3, showParticles: true });
			setCooldownBoost(player, sensor);
		} break;
		case 6: {
			player.addEffect("speed", 200, { amplifier: 3, showParticles: true });
			setCooldownBoost(player, sensor);
		} break;
		case 7: {
			let inv = player.getComponent("minecraft:inventory").container;
			let item1 = new mc.ItemStack("ha:wing_item");
			item1.lockMode = mc.ItemLockMode.inventory;
			item1.setLore(["§bEste item te lanzara por los aires.", "", "§bThis item will launch you into the air."]);
			inv.addItem(item1);
			setCooldownBoost(player, sensor);
		} break;
		case 8: {
			if (player.hasTag("player")) {
				player.sendMessage({ translate: "chat.notnt_item" });
				player.playSound("ui.error_blocked");
				return;
			} else if (player.hasTag("tntPlayer")) {
				let scoreboard = mc.world.scoreboard;
				let objective = scoreboard.getObjective("totalInGame");
				for (const entity of dimension.getEntities({ type: 'ha:sensor', tags: ["ingame"] })) {
					objective.setScore(entity, 28);
				};
				mc.world.sendMessage({ translate: "chat.timerreset" });
				dimension.runCommand(`execute as @a at @s run playsound ui.used_clock`);
				setCooldownBoost(player, sensor);
			};
		} break;
		case 9: {
			let inv = player.getComponent("minecraft:inventory").container;
			let item1 = new mc.ItemStack("minecraft:elytra");
			item1.lockMode = mc.ItemLockMode.inventory;
			inv.addItem(item1);
			player.runCommand(`give @s firework_rocket 3`);
			setCooldownBoost(player, sensor);
		} break;
		case 10: {
			if (player.hasTag("player")) {
				mc.world.sendMessage({ translate: "chat.debuff_slowness" });
				dimension.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				for (const tntPlayers of dimension.getEntities({ type: 'minecraft:player', tags: [ "tntPlayer" ] })) {
					tntPlayers.addEffect("slowness", 60, { amplifier: 9, showParticles: true });
				};
				setCooldownBoost(player, sensor);
			} else if (player.hasTag("tntPlayer")) {
				mc.world.sendMessage({ translate: "chat.debuff_slowness_tnt" });
				dimension.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				for (const players of dimension.getEntities({ type: 'minecraft:player', tags: [ "player" ] })) {
					players.addEffect("slowness", 60, { amplifier: 9, showParticles: true });
				};
				setCooldownBoost(player, sensor);	
			};
		} break;
		case 11: {
			let inv = player.getComponent("minecraft:inventory").container;
			let item1 = new mc.ItemStack("ha:net_gun", 3);
			item1.lockMode = mc.ItemLockMode.inventory;
			inv.addItem(item1);
			setCooldownBoost(player, sensor);
		} break;
	};
};

function setCooldownBoost(player, sensor) {
	sensor.triggerEvent("ha:interact_despawn");
	player.addTag("cooldownBuff");
	player.playSound("ui.used_boost");
	mc.system.runTimeout(() => {
		player.removeTag("cooldownBuff");
	}, 240);	
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */