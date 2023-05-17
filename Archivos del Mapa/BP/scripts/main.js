/* Creado/Editado por: HaJuegos Cat! & Convex!. Si necesitas mas informacion, hablamos en Discord: https://discord.com/users/714622708649951272 & https://discord.com/users/736761089056047174 */
/* Created/Edited by: HaCatto! & Convex! If you need more information, we talk on Discord: https://discord.com/users/714622708649951272 & https://discord.com/users/736761089056047174 */

import { world, system } from "@minecraft/server";

system.events.beforeWatchdogTerminate.subscribe((eventData) => {
	eventData.cancel = true;
});

world.events.entityHurt.subscribe(({ hurtEntity, damageSource }) => {
	let damagingEntity = damageSource.damagingEntity;
	if (damagingEntity.typeId == 'minecraft:player') {
		if (hurtEntity.typeId == 'minecraft:player' && hurtEntity.hasTag("victim")) {
			hurtEntity.runCommandAsync(`event entity @s ha:become_tnt`);
			damagingEntity.runCommandAsync(`event entity @s ha:tnt_pass`);
		};
	};
});

world.events.itemUse.subscribe(eventSayCoords => {
    let players = eventSayCoords.source;
    let item = eventSayCoords.item;
    if (item.typeId == 'ha:detector') {
        let player = Array.from(world.getPlayers()).find(plr => plr.name == players.name);
        player.runCommandAsync(`tag @r[tag=victim] add saycoords`);
        const totalPlayers = Array.from(world.getPlayers());
        for (const p of totalPlayers) {
            if (p.hasTag("saycoords")) {
                p.runCommandAsync(`tellraw @a[tag=tnt_player] {"rawtext": [{"translate":"message.use_player_supercompass_cooords", "with": {"rawtext": [{"selector":"@s"},{"text":"${Math.floor(p.location.x)}"},{"text":"${Math.floor(p.location.y)}"},{"text":"${Math.floor(p.location.z)}"}]}}]}`);
                p.runCommandAsync(`tag @s remove saycoords`);
            };
        };
    };
});

world.events.playerSpawn.subscribe(playerspawned =>{
    let player = playerspawned.player;
	player.runCommandAsync(`scoreboard objectives add winsteak dummy scoreboard.name_wins`);
	player.runCommandAsync(`scoreboard objectives add lobbyj dummy`);
	player.runCommandAsync(`execute as @s[tag=!summon] run summon ha:setup ~ ~10 ~`);
});

system.runInterval(checkPlayersWithTag => {
	try {
		let playersWithTag = [];
		let playersWithNoTag = [];
		let playersNoTag = [];
		const players = world.getPlayers();
		for (const player of players) {
			if (player.hasTag("victim")) {
				playersWithTag.push(player);
			} else if (player.hasTag("tnt_player")) {
				playersWithNoTag.push(player);
			} else {
				playersNoTag.push(player);
			};
		};
		world.getDimension("overworld").runCommandAsync(`scoreboard players set @e[type=ha:setup,tag=!ingame] lobbyj ${playersNoTag.length}`);
		world.getDimension("overworld").runCommandAsync(`scoreboard players set @e[type=ha:setup,tag=ingame] jugadores ${playersWithTag.length}`);
		world.getDimension("overworld").runCommandAsync(`scoreboard players set @e[type=ha:setup,tag=ingame] cazadores ${playersWithNoTag.length}`);
	} catch { };
}, 1);

system.runInterval(checkTnPlayer=> {
	world.getDimension("overworld").runCommandAsync(`execute as @e[type=ha:setup,tag=ingame,scores={cazadores=..0}] run function system/asign_rol`);
}, 120);

system.runInterval(() => {
	world.getDimension("overworld").runCommandAsync(`execute as @e[type=ha:setup,tag=!ingame] run testfor @a[m=spectator,tag=!admin]`).then(sucess => {
		world.getDimension("overworld").runCommandAsync(`gamemode a @a[m=spectator,tag=!admin,tag=!spect]`);
	});
	for (const player of world.getPlayers()) {
		if (player.hasTag("kill")) {
			player.runCommandAsync('function tnt_game/boom_player');
		};
	};
}, 1);

function runCommandAsync(command) {
    try {
        return {
            error: false, ...world.getDimension("overworld").runCommandAsync(command)
        }
    } catch (error) {
        return {
            error: true
        }
    }
}

/* Creado/Editado por: HaJuegos Cat! & Convex!. Si necesitas mas informacion, hablamos en Discord: https://discord.com/users/714622708649951272 & https://discord.com/users/736761089056047174 */
/* Created/Edited by: HaCatto! & Convex! If you need more information, we talk on Discord: https://discord.com/users/714622708649951272 & https://discord.com/users/736761089056047174 */