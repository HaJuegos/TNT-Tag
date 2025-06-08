/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from '@minecraft/server';
import { getAllEntitiesInAllDime, ticksConvertor } from "../globalVariables";
import { listOfTimers } from "./types";
import { checkEffectsMaps, checkInBlock, checkInVoid, hasItemInInv, startTimer } from './extraFn';
// Loop de quitar sombras cada 5sg
mc.system.runInterval(() => {
    try {
        mc.world.getDimension('overworld').runCommand(`effect @e[type=ha:power_ups] invisibility 20 0 true`);
        mc.world.getDimension('overworld').runCommand(`effect @e[type=ha:collider_net_projectile] invisibility 20 0 true`);
        mc.world.getDimension('overworld').runCommand(`effect @e[type=ha:collider_companion_cube_entity] invisibility 20 0 true`);
    }
    catch { }
}, ticksConvertor(5));
// Diversos Loops para el juego, como el tp al lobby, invi a los npcs y los nombres en repeat
mc.system.runInterval(() => {
    try {
        // Quitar el item
        mc.world.getDimension('overworld').runCommand(`clear @a[tag=!hasPly] ha:player_projectile`);
        for (const ply of mc.world.getAllPlayers().filter(ply => ply.hasTag('hasPly'))) {
            const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;
            if (inv) {
                const item = new mc.ItemStack('ha:player_projectile');
                item.lockMode = mc.ItemLockMode.inventory;
                item.setLore(["By using this item, you will be able to launch the \nplayer you have in your hands (Auxiliary Item).", "", "Al usar este ítem, podrás lanzar al \njugador que tengas en tus manos. (Ítem Auxiliar)"]);
                if (!hasItemInInv(inv, 'ha:player_projectile')) {
                    inv.addItem(item);
                }
            }
        }
        const inGame = getAllEntitiesInAllDime({ type: 'ha:game_entity' });
        if (inGame.length <= 0) {
            for (const ply of mc.world.getAllPlayers().filter(ply => !ply.hasTag('admin'))) {
                if (Math.floor(ply.location.y) <= 43) {
                    ply.teleport({ x: 2031.84, y: 52.36, z: -1967.97 });
                }
            }
        }
        ;
        if (inGame[0].hasTag('inGame')) {
            const glowTime = getAllEntitiesInAllDime({ type: 'ha:glowing_entity', tags: ['glowActivated'] });
            const glowActive = glowTime.length > 0;
            for (const ply of mc.world.getAllPlayers().filter(ply => !ply.hasTag('spectMode'))) {
                const hasCoin = ply.hasTag('activatedCoin');
                const hasTNT = ply.hasTag('tntPly');
                if (glowActive) {
                    ply.nameTag = hasCoin ? `§e§l[COIN ACTIVATED]§r\n ${ply.name} ` : hasTNT ? ` §c§l[TNT]§r \n${ply.name}` : ` ${ply.name} `;
                }
                else {
                    ply.nameTag = hasCoin ? `§e§l[COIN ACTIVATED]§r` : `§r`;
                }
                checkInVoid([...getAllEntitiesInAllDime({ type: 'ha:tnt_projectile' }), ply], inGame[0]);
                checkInBlock(ply, inGame[0]);
                checkEffectsMaps(inGame[0]);
            }
        }
    }
    catch { }
}, ticksConvertor(0.15));
// Loop principal de los timers.
mc.system.runInterval(() => {
    try {
        for (const timer of listOfTimers) {
            startTimer(timer);
        }
    }
    catch { }
}, ticksConvertor(1));
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
