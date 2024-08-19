/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { listOfCommands, spawnZonesMap1, spawnZonesMap2, spawnZonesMap3, spawnZonesMap4, spawnZonesMap5, spawnZonesMap6, spawnZonesMap7 } from "./variables.js";
import { inGlow, ticksConvertor } from "./items.js";
import { votationTime } from "./customCommands.js";
import { dataPlayers, gameStart, returnNametags, startMusic, startMusicLobby } from "./loops.js";

import './adminStaff.js';
// import './testplayers.js';

export const overworld = mc.world.getDimension('overworld');

mc.world.afterEvents.worldInitialize.subscribe(setupWorld => {
	try {
		listOfCommands.forEach(cmd => {
			overworld.runCommandAsync(cmd);
		});
	} catch {};
});

mc.world.afterEvents.playerSpawn.subscribe(playerSpawned => {
	try {
		const player = playerSpawned.player;
		playerSetAndCheck(player);
	} catch {};
});

mc.world.afterEvents.projectileHitBlock.subscribe(arrowSensorBlock => {
	try {
		const projectile = arrowSensorBlock.projectile;
		const source = arrowSensorBlock.source;
		if (projectile?.typeId == 'minecraft:snowball') {
			const variant = projectile?.getComponent("minecraft:variant");
			if (variant?.value == 1) {
				if (!source?.hasTag("tntPlayer")) {
					projectile?.remove();
				} else {
					mc.system.runTimeout(() => {
						if (source?.hasTag("tntPlayer")) {
							source?.sendMessage({ translate: "chat.error_nohittnt" });
							source?.playSound("ui.error_blocked");
							source?.runCommand(`scriptevent ha:tnt_staff`);
							projectile?.remove();
						} else {
							projectile?.remove();
						};
					}, ticksConvertor(2));
				};
			};
		};
	} catch {};
});

mc.world.afterEvents.projectileHitEntity.subscribe(arrowSensorEntity => {
	try {
		const projectile = arrowSensorEntity.projectile;
		const source = arrowSensorEntity.source;
		const hitEntity = arrowSensorEntity.getEntityHit().entity;
		if (projectile?.typeId == 'minecraft:snowball') {
			const variant = projectile?.getComponent("minecraft:variant");
			if (variant?.value == 1) {
				if (source?.hasTag("tntPlayer") && hitEntity?.hasTag("player")) {
					projectile?.remove();
				} else {
					mc.system.runTimeout(() => {
						if (source?.hasTag("tntPlayer")) {
							source?.sendMessage({ translate: "chat.error_nohittnt" });
							source?.playSound("ui.error_blocked");
							source?.runCommand(`scriptevent ha:tnt_staff`);
							projectile?.remove();
						} else {
							projectile?.remove();
						};
					}, ticksConvertor(2));
				};
			} else if (variant?.value == 2 && hitEntity?.typeId == 'minecraft:player') {
				if (hitEntity?.hasTag("inNet")) return;
				hitEntity?.runCommand(`playsound ui.netgun.hit @a ~~~`);
				hitEntity?.runCommand(`playsound player.hitnet @a ~~~`);
				hitEntity?.triggerEvent("ha:in_net");
				projectile?.remove();
			};
		};
	} catch {};
});

mc.world.afterEvents.entityHurt.subscribe(damageSensor => {
	try {
		const hurtEntity = damageSensor.hurtEntity;
		const source = damageSensor.damageSource;
		const damagingEntity = source.damagingEntity;
		const cause = source.cause;
		if (hurtEntity.typeId == 'minecraft:player' && damagingEntity?.typeId == 'minecraft:player') {
			if (cause == 'projectile') {
				damagingEntity?.playSound("player.bow_hit");
			};
			if (damagingEntity?.hasTag("tntPlayer")) {
				hurtEntity.triggerEvent("ha:give_tnt");
				damagingEntity?.triggerEvent("ha:receive_tnt");
			};
		};
	} catch {};
});

mc.world.afterEvents.playerInteractWithEntity.subscribe(interactSensor => {
	try {
		const entity = interactSensor.target;
		const player = interactSensor.player;
		if (entity.typeId == 'ha:generator_entity') {
			checkVariant(player, entity);
		};
	} catch {};
});

mc.world.beforeEvents.playerInteractWithBlock.subscribe(async (blockSensor) => {
	try {
		const player = blockSensor.player;
		const block = blockSensor.block;
		if (votationTime || gameStart) return;
		if (block.typeId == 'minecraft:stone_button') {
			const coords = { x: Math.round(block.location.x), y: Math.round(block.location.y), z: Math.round(block.location.z) };
			if (coords.x == 2035 && coords.y == 53 && coords.z == -1977) {
				await null;
				player.runCommand(`scriptevent ha:check_players`);
			};
		} else if (block.typeId == 'minecraft:warped_button') {
			const coords = { x: Math.round(block.location.x), y: Math.round(block.location.y), z: Math.round(block.location.z) };
			if (coords.x == 1947 && coords.y == 61 && coords.z == -2008) {
				await null;
				player.runCommand(`function regaloomaga`);
			};
		};
	} catch {};
});

mc.world.afterEvents.entityHitEntity.subscribe(hitSensor => {
	try {
		const meleeEntity = hitSensor.damagingEntity;
		const damageEntity = hitSensor.hitEntity;
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
		const entity = staticEvents.sourceEntity;
		switch (staticEvents.id) {
			case 'ha:check_players': {
				const players = mc.world.getPlayers();
				if (players.length > 1) {
					mc.world.sendMessage({translate: "chat.gameStarted", with: {rawtext: [{text: `${players.length}`}]}});
					overworld.runCommand(`execute as @a at @s run playsound random.levelup`);
					overworld.runCommand(`scriptevent ha:starting_votation`);
				} else {
					mc.world.sendMessage({translate: "chat.error_noplayers"});
					overworld.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				};
			} break;
			case 'ha:reselect_tntplayers': {
				const players = overworld.getEntities({ type: 'minecraft:player', tags: ['player'] });
				const allPlayers = overworld.getEntities({ type: 'minecraft:player' });
				const scoreboard = mc.world.scoreboard;
				const objective1 = scoreboard.getObjective("players");
				const objective2 = scoreboard.getObjective("tntPlayers");
				const livePlayers = allPlayers.filter(player => player.hasTag('player')).length || 0;

				overworld.getEntities({ type: 'ha:sensor' }).forEach(entity => {
					const score1 = objective1.getScore(entity);
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
				});
			} break;
			case 'ha:set_lore': {
				const inv = entity.getComponent("minecraft:inventory").container;
				const newItem = new mc.ItemStack("ha:coin_item");
				for (let i = 0; i < inv.size; i++) {
					let item = inv.getItem(i);
					if (item?.typeId == 'ha:coin_item' && item?.getLore().length == 0) {
						newItem.setLore(["§bEste item te protejera de los jugadores con TNT", "", "§bThis item will protect you from TNT players"]);
						inv?.setItem(i, newItem);
					};
				};
			} break;
			case 'ha:set_lore_two': {
				const inv = entity.getComponent("minecraft:inventory").container;
				const newItem = new mc.ItemStack("ha:wing_item");
				for (let i = 0; i < inv?.size; i++) {
					let item = inv?.getItem(i);
					if (item?.typeId == 'ha:wing_item' && item?.getLore().length == 0) {
						newItem.setLore(["§bEste item te lanzara por lo mas alto", "", "§bThis item will launch you over the top"]);
						inv?.setItem(i, newItem);
					};
				};
			} break;
			case 'ha:tnt_staff': {
				const newItem1 = new mc.ItemStack("ha:tnt_helmet");
				const newItem2 = new mc.ItemStack("ha:tnt_item_hand");
				const newItem3 = new mc.ItemStack("ha:super_compass");
				const newItem4 = new mc.ItemStack("ha:rolling_players");
				const inv = entity.getComponent("minecraft:inventory").container;
				const invArmor = entity.getComponent("minecraft:equippable");

				newItem1.lockMode = mc.ItemLockMode.slot;
				newItem2.lockMode = mc.ItemLockMode.inventory;
				newItem3.lockMode = mc.ItemLockMode.inventory;
				newItem4.lockMode = mc.ItemLockMode.inventory;
				invArmor?.setEquipment(mc.EquipmentSlot.Head, newItem1);
				let hasItem2 = false;
				let hasItem3 = false;
				let hasItem4 = false;

				for (let i = 0; i < inv?.size; i++) {
					let item = inv?.getItem(i);
					if (item?.typeId == newItem2.typeId) {
						hasItem2 = true;
					};
					if (item?.typeId == newItem3.typeId) {
						hasItem3 = true;
					};
					if (item?.typeId == newItem4.typeId) {
						hasItem4 = true;
					};
				};

				if (!hasItem2) {
					inv?.addItem(newItem2);
				};

				if (!hasItem3) {
					inv?.addItem(newItem3);
				};

				if (!hasItem4) {
					inv?.addItem(newItem4);
				};
			} break;
			case 'ha:end_game_name': {
				returnNametags();
				if (inGlow) {
					mc.world.sendMessage({translate: "chat.compass_deactivated"});
					inGlow = false;
					overworld.runCommand(`event entity @a[tag=!spect] ha:remove_glowing`);
					overworld.runCommand(`time set day`);
					overworld.runCommand(`execute as @a at @s run playsound mob.zombie.unfect`);
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
				}, ticksConvertor(6));
			} break;
		};
	} catch {};
});

/**
 * Revisa si el jugador ya estuvo jugando antes para hacer pre-ajustes y tambien asignar pre-ajustes de spawn
 * @param {mc.Player} player Jugador que sera revisado
 * @returns {Void} Todos los ajustes del function
 */
function playerSetAndCheck(player) {
    player.addEffect("saturation", 999999, { amplifier: 100, showParticles: false });
    player.runCommand(`hud @s hide health`);
    player.runCommand(`hud @s hide hunger`);
    player.runCommand(`hud @s hide armor`);
    player.runCommand(`hud @s hide air_bubbles`);
    player.runCommand(`hud @s hide progress_bar `);
	if (gameStart) {
		let getData = dataPlayers[player.name];
		if (getData) {
			let searchActualMap = getData.maps;
			if (getData.hasPlayerTag || getData.hasTntPlayerTag && searchActualMap && searchActualMap.length > 0) {
				let mapCounts = {};
				let maxCount = 0;
				let mostCommonMap = null;
				for (const playerName in dataPlayers) {
					let playerData = dataPlayers[playerName];
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
						map1: spawnZonesMap1,
						map2: spawnZonesMap2,
						map3: spawnZonesMap3,
						map4: spawnZonesMap4,
						map5: spawnZonesMap5,
						map6: spawnZonesMap6,
						map7: spawnZonesMap7
					};
					spawnZones = mapSpawnZones[searchActualMap];
					let randomIndex = Math.floor(Math.random() * spawnZones.length);
					let randomSpawnZone = spawnZones[randomIndex];
					player.tryTeleport(randomSpawnZone, { dimension: player.dimension });
					player.removeTag(`${searchActualMap}`);
					player.addTag(`${mostCommonMap}`);
					startMusic(player);
					let message = {translate: "chat.return_game"};
					player.sendMessage(message);
					if (!inGlow) {
						player.triggerEvent("ha:remove_glowing");
						player.nameTag = "";
					};
				};
			};
		} else {
			startMusic(player);
			if (player.hasTag("spect")) {
				let message = {translate: "chat.return_ingame"};
				player.sendMessage(message);
				player.runCommand(`tp @r[tag=player]`);
			} else {
				player.runCommand(`function system/now_spectator`);
			};
		};
	} else {
		if (player.hasTag("spect")) {
			player.runCommand(`function system/player_return_lobby`);
			startMusicLobby(player);
		} else if (player.hasTag("tntPlayer") || player.hasTag("player")) {
			player.runCommand(`function system/player_return_lobby`);
			startMusicLobby(player);
		} else {
			startMusicLobby(player);
		};
	};
};

/**
 * Todas las acciones de las entidades que proporcionan boots a los jugadores normales y las tnt.
 * @param {mc.Player} player Jugador a quien le afectara el evento
 * @param {mc.Entity} sensor Entidad boost al cual se revisara su boost
 * @returns {Void}
 */
function checkVariant(player, sensor) {
    if (player.hasTag("cooldownBuff")) {
		player.sendMessage({ translate: "chat.cooldown_debuff" });
        player.playSound("ui.error_blocked");
        return;
    };
    const variant = sensor.getComponent('minecraft:variant');
	switch (variant?.value) {
		case 1: {
			if (player.hasTag("player")) {
				mc.world.sendMessage({ translate: "chat.debuff_blidness" });
				overworld.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				overworld.getEntities({ type: 'minecraft:player', tags: [ "tntPlayer" ] }).forEach(tntPlayers => {
					tntPlayers.addEffect("blindness", 100, { amplifier: 0, showParticles: true });
				});
				setCooldownBoost(player, sensor);

			} else if (player.hasTag("tntPlayer")) {
				mc.world.sendMessage({ translate: "chat.debuff_blindness_tnt" });
				overworld.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				overworld.getEntities({ type: 'minecraft:player', tags: [ "player" ] }).forEach(players => {
					players.addEffect("blindness", 100, { amplifier: 0, showParticles: true });
				});
				setCooldownBoost(player, sensor);	
			};
		} break;
		case 2: {
			const inv = player.getComponent("minecraft:inventory").container;
			const item1 = new mc.ItemStack("minecraft:bow");
			const item2 = new mc.ItemStack("minecraft:arrow", 3);

			item1.lockMode = mc.ItemLockMode.inventory;
			item2.lockMode = mc.ItemLockMode.inventory;
			inv?.addItem(item1);
			inv?.addItem(item2);
			setCooldownBoost(player, sensor);
		} break;
		case 3: {
			if (player.hasTag("player")) {
				const inv = player.getComponent("minecraft:inventory").container;
				const item1 = new mc.ItemStack("ha:coin_item");

				item1.lockMode = mc.ItemLockMode.inventory;
				item1.setLore(["§bEste item te protege de la TNT.", "", "§bThis item protects you from TNT."]);
				inv?.addItem(item1);
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
			const inv = player.getComponent("minecraft:inventory").container;
			const item1 = new mc.ItemStack("ha:wing_item");

			item1.lockMode = mc.ItemLockMode.inventory;
			item1.setLore(["§bEste item te lanzara por los aires.", "", "§bThis item will launch you into the air."]);
			inv?.addItem(item1);
			setCooldownBoost(player, sensor);
		} break;
		case 8: {
			if (player.hasTag("player")) {
				player.sendMessage({ translate: "chat.notnt_item" });
				player.playSound("ui.error_blocked");
				return;
			} else if (player.hasTag("tntPlayer")) {
				const scoreboard = mc.world.scoreboard;
				const objective = scoreboard.getObjective("totalInGame");

				overworld.getEntities({ type: 'ha:sensor', tags: ["ingame"] }).forEach(entity => {
					objective.setScore(entity, 28);
				});
				mc.world.sendMessage({ translate: "chat.timerreset" });
				overworld.runCommand(`execute as @a at @s run playsound ui.used_clock`);
				setCooldownBoost(player, sensor);
			};
		} break;
		case 9: {
			const inv = player.getComponent("minecraft:inventory").container;
			const item1 = new mc.ItemStack("minecraft:elytra");

			item1.lockMode = mc.ItemLockMode.inventory;
			inv?.addItem(item1);
			player.runCommand(`give @s firework_rocket 3`);
			setCooldownBoost(player, sensor);
		} break;
		case 10: {
			if (player.hasTag("player")) {
				mc.world.sendMessage({ translate: "chat.debuff_slowness" });
				overworld.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				overworld.getEntities({ type: 'minecraft:player', tags: [ "tntPlayer" ] }).forEach(tntPlayers => {
					tntPlayers.addEffect("slowness", 60, { amplifier: 9, showParticles: true });
				});
				setCooldownBoost(player, sensor);
			} else if (player.hasTag("tntPlayer")) {
				mc.world.sendMessage({ translate: "chat.debuff_slowness_tnt" });
				overworld.runCommand(`execute as @a at @s run playsound ui.error_noplayers`);
				overworld.getEntities({ type: 'minecraft:player', tags: [ "player" ] }).forEach(players => {
					players.addEffect("slowness", 60, { amplifier: 9, showParticles: true });
				});
				setCooldownBoost(player, sensor);	
			};
		} break;
		case 11: {
			const inv = player.getComponent("minecraft:inventory").container;
			const item1 = new mc.ItemStack("ha:net_gun", 3);

			item1.lockMode = mc.ItemLockMode.inventory;
			inv?.addItem(item1);
			setCooldownBoost(player, sensor);
		} break;
	};
};

/**
 * Le pone cooldown tanto al jugador como a la entidad que entrega el boost ajustado para esperar unos segundos para dar otra vez el efecto.
 * @param {mc.Player} player Jugador al cual le afectara el cooldown
 * @param {mc.Entity} sensor Entidad al cual le afectara el cooldown
 * @returns {Void}
 */
function setCooldownBoost(player, sensor) {
	sensor.triggerEvent("ha:interact_despawn");
	player.addTag("cooldownBuff");
	player.playSound("ui.used_boost");
	mc.system.runTimeout(() => {
		player.removeTag("cooldownBuff");
	}, ticksConvertor(12));	
};
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */