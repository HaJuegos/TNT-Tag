/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Entity, EntityDamageCause, Player, system, world } from '@minecraft/server';

import { overworld, scoreboard, ticksConvertor } from './worldStart';
import { checkArrowDamage } from '../functions/damageFunctions';
import { checkVariantMob } from '../functions/interactsFunctions';
import { addDataTemp } from '../functions/shopFunctions';

world.afterEvents.projectileHitBlock.subscribe(arrowBlock => {
    try {
        const { projectile, source } = arrowBlock;

        if (!(source instanceof Player) || !(projectile instanceof Entity)) return;

        if (projectile.typeId == 'minecraft:snowball') {
            const variant = projectile.getComponent('variant')?.value;

            if (variant == 1) {
                system.runTimeout(() => {
                    projectile.remove();

                    if (source.hasTag("tntPlayer")) {
                        source.sendMessage({ translate: "chat.error_nohittnt" });
                        source.playSound("ui.error_blocked");
                        source.runCommand(`scriptevent ha:tnt_staff`);
                    };
                }, ticksConvertor(2));
            } else if (variant == 2) {
                system.runTimeout(() => {
                    projectile.remove();
                }, ticksConvertor(2));
            } else if (variant == 3) {
                overworld.runCommand(`playsound mob.companion.hit @a ${projectile.location.x} ${projectile.location.y} ${projectile.location.z}`);

                system.runTimeout(() => {
                    projectile?.remove();
                }, ticksConvertor(4.5));
            };
        };
    } catch {};
});

world.afterEvents.projectileHitEntity.subscribe(arrowEntity => {
    try {
        const { projectile, source } = arrowEntity;
        const hitEntity = arrowEntity.getEntityHit().entity;
        const obj = scoreboard.getObjective('coinsPlys');

        if (!(source instanceof Player) || !(hitEntity instanceof Player)) return;

        if (projectile.typeId == 'minecraft:snowball') {
            const variant = projectile.getComponent('variant')?.value;

            if (variant == 1 && (source.hasTag("tntPlayer") && hitEntity.hasTag("player"))) {
                system.runTimeout(() => {
                    if (source.hasTag("tntPlayer")) {
                        source.sendMessage({ translate: "chat.error_nohittnt" });
                        source.playSound("ui.error_blocked");
                        source.runCommand(`scriptevent ha:tnt_staff`);
                    };
                }, ticksConvertor(2));
            } else if (variant == 2) {
                if (hitEntity.hasTag("inNet")) return;

                hitEntity.runCommand(`playsound ui.netgun.hit @a ~~~`);
                hitEntity.runCommand(`playsound player.hitnet @a ~~~`);
                hitEntity.triggerEvent("ha:in_net");

                obj?.addScore(source, 15);
            } else if (variant == 3) {
                if (hitEntity.hasTag("coinPlayer")) return;

                hitEntity.runCommand(`function system/cube_anim`);
                hitEntity.runCommand(`camerashake add @a[r=12] 2.0 0.5`);

                addDataTemp(hitEntity, 1, false, true);

                obj?.addScore(source, 50);

                projectile.clearVelocity();
                projectile.applyImpulse({ x: 0, y: 0.45, z: 0 });
            };
        } else if (projectile.typeId == 'minecraft:arrow') {
            checkArrowDamage(hitEntity);
        };
    } catch {};
});

world.afterEvents.entityHurt.subscribe(damageSensor => {
    try {
        const { hurtEntity, damageSource } = damageSensor;
        const damageEntity = damageSource.damagingEntity;
        const cause = damageSource.cause;
        const obj = scoreboard.getObjective('coinsPlys');

        if (!(hurtEntity instanceof Player) || !(damageEntity instanceof Player)) return;

        if (cause == EntityDamageCause.projectile) {
            damageEntity.playSound("player.bow_hit");
        };

        if (!hurtEntity.hasTag("coinPlayer") && damageEntity.hasTag("tntPlayer") && hurtEntity.hasTag("player")) {
            hurtEntity.triggerEvent("ha:give_tnt");
            damageEntity.triggerEvent("ha:receive_tnt");

            hurtEntity.removeEffect('invisibility');

            obj?.addScore(damageEntity, 1);
            addDataTemp(damageEntity, 1, false, false, false, false, false, true);

            if (hurtEntity.hasTag('glow')) {
                hurtEntity.triggerEvent("ha:remove_glowing");
                damageEntity.triggerEvent("ha:set_glowing");
            } else if (damageEntity.hasTag('glow')) {
                damageEntity.triggerEvent("ha:remove_glowing");
                hurtEntity.triggerEvent("ha:set_glowing");
            };
        };
    } catch {};
});

world.afterEvents.entityHitEntity.subscribe(hitSensor => {
    try {
        const { damagingEntity, hitEntity } = hitSensor;

        if (hitEntity.typeId == 'ha:generator_entity') {
            if (damagingEntity.typeId != 'minecraft:player') return;
            // @ts-ignore
            checkVariantMob(damagingEntity, hitEntity);
        };
    } catch {};
});
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */