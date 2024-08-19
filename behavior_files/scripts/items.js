/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from '@minecraft/server';

import { overworld } from './main.js';
import { hideNametags, returnNametags } from './loops.js';

const itemsComponents = [
    'ha:use_item_actions'
];
export let inGlow = false;
let allCoords = {};
let elytraTime = {};

/**
 * Un clase que contiene diversas acciones dependiendo el item para ejecutar cuando "onUse" sucede
 */ 
class itemActions {
	/**
     * Inicializador de los eventos para obtener los argumentos del evento OnUse
     * @param {mc.ItemStack} item El item a usar
     * @param {mc.Player} player El juagdor o entidad que le afectara la accion
     */
	constructor(item, player) {
		this.item = item;
		this.player = player;
	};
	
	/** Revisa que items tienen acciones para ejecutarlos al momento de usarse
	 * @returns {Void}
	*/
	checkActions() {
		switch(this.item?.typeId) {
			case 'ha:calculator': {
				this.calculatorActions();
			} break;
			case 'ha:super_compass': {
				this.compassActions();
			} break;
			case 'ha:coin_item': {
				this.coinActions();
			} break;
			case 'ha:rolling_players': {
				this.rollActions();
			} break;
			case 'ha:wing_item': {
				this.wingActions();
			} break;
			case 'ha:tnt_item_hand': {
				this.tntActions();
			} break;
		};
	};

	calculatorActions() {
		if (this.player.hasTag("voted")) {
			this.player.playSound("ui.error_noplayers");
			this.player.sendMessage({translate: "chat.yep_voting"});
		} else {
			this.player.runCommand(`scriptevent ha:voting`);
		};
	};
	
	compassActions() {
		const cooldown = this.item.getComponent('cooldown');
		mc.world.sendMessage({translate: "chat.compass_activated"});
		inGlow = true;
		mc.world.setTimeOfDay(18000);
		overworld.runCommand(`execute as @a at @s run playsound ui.used_compass`);
		returnNametags();

		for (const players of mc.world.getAllPlayers()) {
			cooldown.startCooldown(players);
		};

		mc.system.runInterval(() => {
			if (inGlow) {
				mc.world.sendMessage({translate: "chat.compass_deactivated"});
				inGlow = false;
				overworld.runCommand(`event entity @a[tag=!spect] ha:remove_glowing`);
				mc.world.setTimeOfDay(1000);
				overworld.runCommand(`execute as @a at @s run playsound mob.zombie.unfect`);
				hideNametags();
			};
		}, ticksConvertor(25));
	}

	coinActions() {
		const armorInv = this.player.getComponent('equippable');
		const inv = this.player.getComponent('inventory').container;
		const chestItem = armorInv.getEquipment(mc.EquipmentSlot.Chest);
		const newItem = new mc.ItemStack('minecraft:netherite_chestplate', 1);
		const elytraItem = new mc.ItemStack('minecraft:elytra', 1);
		const cooldown = this.item.getComponent('cooldown');
		const slot = this.player.selectedSlotIndex;

		newItem.lockMode = mc.ItemLockMode.slot;

		if (this.player.hasTag("tntPlayer")) {
			this.player.sendMessage({translate: "chat.no_coin_activate"});
			this.player.playSound("ui.error_blocked");
		} else {
			inv.setItem(slot, null);
			this.player.sendMessage({translate: "chat.activate_coin"});
			this.player.playSound("ui.used_coin");
			cooldown.startCooldown(this.player);
			this.player.triggerEvent("ha:coin_damage");
			this.player.nameTag = `§e§l[COIN ACTIVATED]§r\n${this.player.name}`;

			if (chestItem?.typeId == 'minecraft:elytra') {
				inv.addItem(elytraItem);
				armorInv.setEquipment(mc.EquipmentSlot.Chest, newItem);
			} else {
				armorInv.setEquipment(mc.EquipmentSlot.Chest, newItem);
			};

			mc.system.runTimeout(() => {
				this.player.sendMessage({translate: "chat.removed_coin"});
				this.player.playSound("mob.zombie.unfect");
				this.player.runCommand(`clear @s netherite_chestplate`);
				this.player.triggerEvent("ha:return_normal_damage");
						
				if (inGlow) {
					this.player.nameTag = `${this.player.name}`;	
				} else {
					this.player.nameTag = "§r";
				};
			}, ticksConvertor(8));
		}
	};

	rollActions() {
		const itemCooldown = this.item.getComponent('cooldown');

		overworld.getEntities({ type: 'minecraft:player', tags: [ 'player' ] }).forEach(ply => {
			allCoords[ply.name] = { location: ply.location, viewDirection: ply.getViewDirection() };
		});
		overworld.getEntities({ type: 'minecraft:player', tags: [ 'tntPlayer' ] }).forEach(tntPly => {
			allCoords[tntPly.name] = { location: tntPly.location, viewDirection: tntPly.getViewDirection() };
		});
		overworld.getEntities({ type: 'minecraft:player', excludeTags: [ "spect" ]}).forEach(tempPly => {
			let randomPlayer = getRandomPlayer(tempPly.name);
			let randomCoords = randomPlayer.location;
			let viewDirection = randomPlayer.viewDirection;
			tempPly.tryTeleport(randomCoords, { dimension: overworld, facingLocation: viewDirection });
		});
		
		mc.world.sendMessage({ translate: "chat.rolling_players" });
		overworld.runCommand(`execute as @a at @s run playsound ui.rolling_players`);

		mc.world.getAllPlayers().forEach(e => {
			itemCooldown.startCooldown(e);
		});

		allCoords = {};
	};

	wingActions() {
		const inv = this.player.getComponent('inventory').container;
		const slot = this.player.selectedSlotIndex;
		const coords = this.player.location;
		const cooldown = this.item.getComponent('cooldown');

		this.player.applyKnockback(coords.z, coords.x, 0.1, 1.5);
		this.player.runCommand(`particle minecraft:knockback_roar_particle ~~0.5~`);
		this.player.playSound("mob.enderdragon.flap");
		cooldown.startCooldown(this.player);
		inv.setItem(slot, null);
	};

	tntActions() {
		const cooldown = this.item.getComponent('cooldown');
		mc.world.getAllPlayers().forEach(ply => {
			cooldown.startCooldown(ply);
		});
	};
};

mc.world.afterEvents.itemUse.subscribe(itemsUsed => {
	try {
		const item = itemsUsed.itemStack;
		const player = itemsUsed.source;
		if (item?.typeId == 'minecraft:firework_rocket') {
			const inv = player.getComponent('inventory').container;
			const armorInv = player.getComponent('equippable');
			const itemChest = armorInv.getEquipment(mc.EquipmentSlot.Chest);
			const name = player.name;
			if (itemChest?.typeId == 'minecraft:elytra') {
				if (!elytraTime[name]) {
					elytraTime[name] = 1;
				} else {
					if (elytraTime[name] < 1) {
						elytraTime[name]++;
					} else {
						player.playSound("random.break");
						armorInv.setEquipment(mc.EquipmentSlot.Chest, null);
						for (let i = 0; i < inv.size; i++) {
							let item = inv.getItem(i);
							if (item?.typeId == 'minecraft:elytra') {
								inv.setItem(i, null);
								break;
							};
						};
						delete elytraTime[name];
					}
				}
			};
		};
	} catch {};
});

mc.world.beforeEvents.worldInitialize.subscribe(setItemsClass => {
    itemsComponents.forEach(arg => {
		setItemsClass.itemComponentRegistry.registerCustomComponent(arg, {
			onUse: (event) => {
				try { new itemActions(event.itemStack, event.source).checkActions(); } catch {};
			}
		});
	});
});

/**
 * Obtiene algun jugador aleatorio y reformatea su nombre para evitar bugs
 * @param {mc.Player.name} currentPlayerName El nombre de los jugadores a tomar en cuenta
 * @returns {Object} El jugador aleatorio metido en la variable `allCoords`
 */
function getRandomPlayer(currentPlayerName) {
    let playerNames = Object.keys(allCoords);
    let randomPlayerName;
    do {
        randomPlayerName = playerNames[Math.floor(Math.random() * playerNames.length)];
    } while (randomPlayerName.replace(/\W/g, '') === currentPlayerName.replace(/\W/g, ''));
    return allCoords[randomPlayerName];
};

/**
 * Convierte segundos a ticks.
 * @param {number} value La cantidad de segundos a convertir.
 * @returns {number} El valor en ticks.
 * 
 * @example
 * // Convierte 5 segundos a ticks
 * ticksConvertor(20) // Si mc.TicksPerSecond es 20, el resultado será 100.
 */
export function ticksConvertor(value) {
    return mc.TicksPerSecond * value;
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */