/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, system, world } from "@minecraft/server";

import { ticksConvertor } from "../globalVariables";
import { companionHit, netEvents, returnTnTItem } from "../functions/projectileFn";
import { inGlow } from "../loops/events/glowingLoop";
import { addOrRemoveObj } from "../functions/stadisticFn";

world.afterEvents.projectileHitBlock.subscribe(hitBlock => {
    try {
        const { source, projectile } = hitBlock;

        if (source instanceof Player) {
            if (projectile.typeId == 'ha:tnt_projectile_entity') {
                system.runTimeout(() => {
                    try {
						if (projectile) {
							if (source?.hasTag('tntPly')) {
								returnTnTItem(source);
							}

							projectile.remove();
						}
					} catch {}
                }, ticksConvertor(1.35));
            } else if (projectile.typeId == 'ha:net_projectile') {
                system.runTimeout(() => {
                    try {
						projectile.triggerEvent('ha:start_solid');
					} catch {}
                }, ticksConvertor(0.5));
            } else if (projectile.typeId == 'ha:companion_cube_entity') {
                projectile.runCommand(`playsound item.companion_cube.hit_block @a ~~~`);

                system.runTimeout(() => {
                    try {
						projectile.triggerEvent('ha:start_solid');
					} catch {}
                }, ticksConvertor(0.5));
            }
        }
    } catch { }
});

world.afterEvents.projectileHitEntity.subscribe(hitSensor => {
    try {
        const { source, projectile } = hitSensor;
        const hitEntity = hitSensor.getEntityHit().entity;

        if (source instanceof Player && !(hitEntity instanceof Player) && projectile.typeId == 'ha:tnt_projectile_entity') {
            system.runTimeout(() => {
                try {
					if (projectile) {
						if (source?.hasTag('tntPly')) {
							returnTnTItem(source);
						}

						projectile.remove();
					}
				} catch {}
            }, ticksConvertor(1.35));
        }

        if (source instanceof Player && hitEntity instanceof Player) {
            if (source.hasTag('tntPly') && !hitEntity.hasTag('tntPly')) {
                if (hitEntity.hasTag('activatedCoin')) {
                    source.playSound('ui.powerup.in_cooldown');
                    source.sendMessage({ translate: "chat.player_has_coin" });
                    return;
                }

                source.runCommand(`function system/remove_tnt`);
                hitEntity.runCommand(`function system/give_tnt`);

                source.onScreenDisplay.updateSubtitle('.showtntoff');
                hitEntity.onScreenDisplay.updateSubtitle('.showtnton');

                addOrRemoveObj(source, 'totalPoints', Math.floor(Math.random() * 10) + 1);
                addOrRemoveObj(source, 'totalTNT', 1);

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
                addOrRemoveObj(source, 'totalPoints', Math.floor(Math.random() * 51) + 50);
            }
        }
    } catch { }
});

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */