/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { overworld } from "./main";
import { ticksConvertor } from "./items";

let bannedPlayers = [];

mc.world.beforeEvents.chatSend.subscribe(async (adminChat) => {
	try {
		const sender = adminChat.sender;
		const message = adminChat.message;
		if (sender.hasTag("muted")) {
			adminChat.cancel = true;
			sender.sendMessage({ translate: "chat.muted_player" });
			await null;
			sender.playSound("random.screenshot");
		};
		if (sender.hasTag("Staff")) {
			const commandIndex = message.indexOf(" ");
            if (commandIndex != -1) {
                const command = message.substring(0, commandIndex).toLowerCase();
                const playerName = message.substring(commandIndex + 1).trim().replace(/[@\u00A7"']+/g, '');
				adminChat.cancel = true;
				switch (command) {
                    case "!ban": {
						bannedPlayers.push(playerName);
						sender.sendMessage({ translate: "chat.banned", with: {rawtext: [{text: `${playerName}`}]}});
						await null;
						sender.playSound("random.screenshot");
					} break;
					case "!unban": {
						bannedPlayers.splice(playerName);
						sender.sendMessage({ translate: "chat.unbanned", with: {rawtext: [{text: `${playerName}`}]}});
						await null;
						sender.playSound("random.screenshot");
					} break;
					case "!mute": {
						await null;
						overworld.runCommand(`tag "${playerName}" add muted`);
						sender.sendMessage({ translate: "chat.muted", with: {rawtext: [{text: `${playerName}`}]}});
						sender.playSound("random.screenshot");
					} break;
					case "!unmute": {
						await null;
						overworld.runCommand(`tag "${playerName}" remove muted`);
						sender.sendMessage({ translate: "chat.unmuted", with: {rawtext: [{text: `${playerName}`}]}});
						sender.playSound("random.screenshot");
					} break;
				};
			};
		};
	} catch {};
});

mc.system.runInterval(loopBan => {
	try {
		for (let name of bannedPlayers) {
			overworld.getEntities({ type: 'minecraft:player', name: name }).forEach(players => {
				players.runCommand(`kick "${players.name}" §cBaneado por un Admin.§r`);
			});
		};
	} catch {};
}, ticksConvertor(0.6));
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */