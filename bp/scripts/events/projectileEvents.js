/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { Player, system, world } from "@minecraft/server";
import { ticksConvertor } from "../globalVariables";
import { companionHit, netEvents, returnTnTItem } from "../functions/projectileFn";
import { inGlow } from "../loops/events/glowingLoop";
world.afterEvents.projectileHitBlock.subscribe(hitBlock => {
    try {
        const { source, projectile } = hitBlock;
        if (source instanceof Player) {
            if (projectile.typeId == 'ha:tnt_projectile_entity') {
                projectile.triggerEvent('ha:start_solid');
                system.runTimeout(() => {
                    if (source?.hasTag('tntPly')) {
                        returnTnTItem(source);
                    }
                    projectile.remove();
                }, ticksConvertor(2));
            }
            else if (projectile.typeId == 'ha:net_projectile') {
                projectile.triggerEvent('ha:start_solid');
            }
            else if (projectile.typeId == 'ha:companion_cube_entity') {
                projectile.triggerEvent('ha:start_solid');
                projectile.runCommand(`playsound item.companion_cube.hit_block @a ~~~`);
            }
        }
    }
    catch { }
});
world.afterEvents.projectileHitEntity.subscribe(hitSensor => {
    try {
        const { source, projectile } = hitSensor;
        const hitEntity = hitSensor.getEntityHit().entity;
        if (source instanceof Player && hitEntity instanceof Player) {
            if (source.hasTag('tntPly') && !hitEntity.hasTag('tntPly')) {
                if (hitEntity.hasTag('activatedCoin')) {
                    source.playSound('ui.powerup.in_cooldown');
                    source.sendMessage({ translate: "chat.player_has_coin" });
                    return;
                }
                source.runCommand(`function system/remove_tnt`);
                hitEntity.runCommand(`function system/give_tnt`);
                if (inGlow) {
                    source.triggerEvent('ha:remove_glow');
                    hitEntity.triggerEvent('ha:set_glow');
                }
            }
            if (projectile.typeId == 'ha:net_projectile' && !hitEntity.hasTag('inNet')) {
                netEvents(hitEntity);
                projectile.remove();
            }
            if (projectile.typeId == 'ha:companion_cube_entity') {
                const randomX = Math.random() < 0.5 ? Math.random() * 0.2 : 0;
                const randomZ = Math.random() < 0.5 ? Math.random() * 0.2 : 0;
                projectile.clearVelocity();
                projectile.applyImpulse({ x: randomX, y: 0.45, z: randomZ });
                if (hitEntity.hasTag('activatedCoin')) {
                    source.playSound('ui.powerup.in_cooldown');
                    source.sendMessage({ translate: "chat.player_has_coin" });
                    return;
                }
                companionHit(hitEntity);
            }
        }
    }
    catch { }
});
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
