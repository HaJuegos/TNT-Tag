/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { Player, world } from "@minecraft/server";
import { inGlow } from "./glowingLoop";
/**
 * Eventos del timer de la moneda.
 * @type {TimerLoopBase}
 */
const coinLoop = {
    obj: "timerCoin",
    entities: () => world.getAllPlayers().filter(ply => ply.hasTag('activatedCoin')),
    onTick(ply) {
        if (!(ply instanceof Player))
            return;
        ply.triggerEvent('ha:in_lobby');
        if (inGlow) {
            ply.nameTag = `§e§l[COIN ACTIVATED]§r\n ${ply.name} `;
        }
        else {
            ply.nameTag = `§e§l[COIN ACTIVATED]§r`;
        }
    },
    onComplete(ply) {
        if (!(ply instanceof Player))
            return;
        ply.removeTag('activatedCoin');
        ply.sendMessage({ translate: "chat.removed_coin" });
        ply.playSound('armor.crack_wolf');
        ply.spawnParticle('minecraft:knockback_roar_particle', ply.location);
        ply.triggerEvent('ha:player_damage');
        ply.runCommand(`replaceitem entity @s slot.armor.chest 0 air`);
        if (inGlow) {
            ply.nameTag = ` ${ply.name} `;
        }
        else {
            ply.nameTag = `§r`;
        }
    }
};
export { coinLoop };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
