/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { inGlow } from "../loops/events/glowingLoop";
import { checkSpawnEvents, elytraSystem } from "../functions/plyFn";
import { ticksConvertor } from "../globalVariables";
import { addOrRemoveObj } from "../functions/stadisticFn";

mc.world.afterEvents.entityHurt.subscribe(damageSensor => {
    try {
        const { hurtEntity, damageSource: source } = damageSensor;
        const { damagingEntity: sourceEntity, cause } = source;

        if ((hurtEntity instanceof mc.Player && sourceEntity instanceof mc.Player) && cause == mc.EntityDamageCause.projectile) {
            sourceEntity.playSound(`player.bow_hit`);
        }
    } catch { }
});

mc.world.afterEvents.playerInteractWithEntity.subscribe(interactSensor => {
    try {
        const { player: sourceEntity, target: hitEntity } = interactSensor;

        if ((sourceEntity instanceof mc.Player && hitEntity instanceof mc.Player)) {
            if ((!sourceEntity.hasTag('hasPly') && !sourceEntity.hasTag('inNet')) && hitEntity.hasTag('inNet')) {
                hitEntity.runCommand(`ride @s start_riding "${sourceEntity.name}" teleport_rider`);
                sourceEntity.setDynamicProperty('ha:rider', hitEntity.id);
                sourceEntity.setDynamicProperty('ha:evit_firt', true);

                mc.system.runTimeout(() => {
                    try {
                        if (sourceEntity.hasTag('hasPly')) {
                            hitEntity.runCommand(`ride @s stop_riding`);
                            sourceEntity.setDynamicProperty('ha:rider', "");
                            sourceEntity.setDynamicProperty('ha:evit_firt', true);
                        }
                    } catch { }
                }, ticksConvertor(2));
            }
        }
    } catch { }
});

mc.world.afterEvents.entityHitEntity.subscribe(hitSensor => {
    try {
        const { hitEntity, damagingEntity: sourceEntity } = hitSensor;

        if ((sourceEntity instanceof mc.Player && hitEntity instanceof mc.Player)) {
            if ((!sourceEntity.hasTag('hasPly') && !sourceEntity.hasTag('inNet')) && hitEntity.hasTag('inNet')) {
                sourceEntity.triggerEvent('ha:has_ply');
                hitEntity.runCommand(`ride @s start_riding "${sourceEntity.name}" teleport_rider`);
                sourceEntity.setDynamicProperty('ha:rider', hitEntity.id);
                sourceEntity.setDynamicProperty('ha:evit_firt', true);

                const timerID = mc.system.runTimeout(() => {
                    try {
                        if (sourceEntity.hasTag('hasPly')) {
                            hitEntity.runCommand(`ride @s stop_riding`);
                            sourceEntity.setDynamicProperty('ha:rider', "");
                            sourceEntity.setDynamicProperty('ha:evit_firt', true);
                        }

                        mc.system.clearRun(timerID);
                    } catch { }
                }, ticksConvertor(1.85));
            }

            if (sourceEntity.hasTag('tntPly') && hitEntity.hasTag('normalPly')) {
                if (hitEntity.hasTag('activatedCoin')) {
                    sourceEntity.playSound('ui.powerup.in_cooldown');
                    sourceEntity.sendMessage({ translate: "chat.player_has_coin" });
                    return;
                }

                sourceEntity.runCommand(`function system/remove_tnt`);
                hitEntity.runCommand(`function system/give_tnt`);

                sourceEntity.onScreenDisplay.updateSubtitle('.showtntoff');
                hitEntity.onScreenDisplay.updateSubtitle('.showtnton');

                addOrRemoveObj(sourceEntity, 'totalPoints', Math.floor(Math.random() * 10) + 1);
                addOrRemoveObj(sourceEntity, 'totalTNT', 1);

                if (inGlow) {
                    sourceEntity.triggerEvent('ha:remove_glow');
                    hitEntity.triggerEvent('ha:set_glow');
                }
            }
        }
    } catch { };
});

mc.world.afterEvents.playerSpawn.subscribe(spawnSensor => {
    try {
        const { player } = spawnSensor;

        checkSpawnEvents(player);
    } catch { }
});

mc.world.afterEvents.itemUse.subscribe(useItems => {
    try {
        const { itemStack: item, source: ply } = useItems;

        if (ply instanceof mc.Player) {
            const armorInv = ply.getComponent(mc.EntityComponentTypes.Equippable);
            const chestItem = armorInv?.getEquipment(mc.EquipmentSlot.Chest);

            if ((chestItem && chestItem.typeId == 'minecraft:elytra') && (item.typeId == 'minecraft:firework_rocket')) {
                elytraSystem(ply);
            }
        }
    } catch { }
});

mc.system.afterEvents.scriptEventReceive.subscribe(staticEvents => {
    try {
        const { id, sourceEntity: entity } = staticEvents;

        if (!(entity instanceof mc.Player)) return;

        if (id == 'ha:tnt_items') {
            const inv = entity.getComponent('inventory')?.container;
            const items = [new mc.ItemStack('ha:tnt_projectile'), new mc.ItemStack('ha:rolling_players'), new mc.ItemStack('ha:super_compass')];

            if (inv) {
                for (let i = 0; i < inv.size; i++) {
                    items[i].lockMode = mc.ItemLockMode.inventory;

                    const item = inv.getItem(i);

                    if (item && item.typeId == items[i].typeId) {
                        continue;
                    } else {
                        inv.addItem(items[i]);
                    }
                }
            }
        } else if (id == 'ha:remove_name') {
            entity.nameTag = `§r`;
        } else if (id == 'ha:is_attack') {
            const IDRider = entity.getDynamicProperty('ha:rider');
            const isFirtAtk = entity.getDynamicProperty('ha:evit_firt');
            const getRider = mc.world.getAllPlayers().filter(ply => ply.id == IDRider);
            const rider = getRider[0];

            if (isFirtAtk) {
                entity.setDynamicProperty('ha:evit_firt', false);
            } else {
                if (rider && entity.hasTag('hasPly')) {
                    const viewCoords = entity.getViewDirection();
                    const horizontalPower = 7;
                    const verticalStrength = 0.75;

                    rider.runCommand(`ride @s stop_riding`);
                    mc.system.runTimeout(() => {
                        try {
                            const magnitude = Math.sqrt(viewCoords.x * viewCoords.x + viewCoords.z * viewCoords.z);
                            const horizontalForce = {
                                x: (viewCoords.x / magnitude) * horizontalPower,
                                z: (viewCoords.z / magnitude) * horizontalPower
                            };

                            rider.applyKnockback(horizontalForce, verticalStrength);
                            entity.setDynamicProperty('ha:rider', "");
                        } catch { }
                    }, ticksConvertor(0.15));
                }
            }
        } else if (id == 'ha:drop_all_items') {
            const coords = entity.location;
            const dime = entity.dimension;
            const inv = entity.getComponent(mc.EntityComponentTypes.Inventory)?.container;
            const armorInv = entity.getComponent(mc.EntityComponentTypes.Equippable);
            const armorSlots = [mc.EquipmentSlot.Head, mc.EquipmentSlot.Chest, mc.EquipmentSlot.Legs, mc.EquipmentSlot.Feet, mc.EquipmentSlot.Offhand];
            const filter = ['ha:super_compass', 'ha:player_projectile', 'ha:rolling_players', 'ha:tnt_projectile', 'minecraft:netherite_chestplate', 'ha:tnt_helmet'];

            if (inv) {
                for (let i = 0; i < inv.size; i++) {
                    const item = inv.getItem(i);

                    if (item && !filter.includes(item.typeId)) {
                        const impulse = { x: (Math.random() - 0.5) * 0.6, y: 0.35 + Math.random() * 0.3, z: (Math.random() - 0.5) * 0.6 };
                        const itemEntity = dime.spawnItem(item, coords);

                        inv.setItem(i, undefined);
                        itemEntity.applyImpulse(impulse);
                    }
                }
            }

            if (armorInv) {
                for (const slot of armorSlots) {
                    const armorItem = armorInv.getEquipment(slot);

                    if (armorItem && !filter.includes(armorItem.typeId)) {
                        const impulse = { x: (Math.random() - 0.5) * 0.6, y: 0.35 + Math.random() * 0.3, z: (Math.random() - 0.5) * 0.6 };
                        const itemEntity = dime.spawnItem(armorItem, coords);

                        armorInv.setEquipment(slot, undefined);
                        itemEntity.applyImpulse(impulse);
                    }
                }
            }

            entity.runCommand(`clear @s`);
        }
    } catch { }
});

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */