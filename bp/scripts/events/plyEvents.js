/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { EntityComponentTypes, EntityDamageCause, EquipmentSlot, ItemLockMode, ItemStack, Player, system, world } from "@minecraft/server";
import { inGlow } from "../loops/events/glowingLoop";
import { checkSpawnEvents, elytraSystem } from "../functions/plyFn";
import { ticksConvertor } from "../globalVariables";
world.afterEvents.entityHurt.subscribe(damageSensor => {
    try {
        const { hurtEntity, damageSource: source } = damageSensor;
        const { damagingEntity: sourceEntity, cause } = source;
        if ((hurtEntity instanceof Player && sourceEntity instanceof Player) && cause == EntityDamageCause.projectile) {
            sourceEntity.playSound(`player.bow_hit`);
            sourceEntity.onScreenDisplay.updateSubtitle('.showtntoff');
            hurtEntity.onScreenDisplay.updateSubtitle('.showtnton');
        }
    }
    catch { }
});
world.afterEvents.playerInteractWithEntity.subscribe(interactSensor => {
    try {
        const { player: sourceEntity, target: hitEntity } = interactSensor;
        if ((sourceEntity instanceof Player && hitEntity instanceof Player)) {
            if ((!sourceEntity.hasTag('hasPly') && !sourceEntity.hasTag('inNet')) && hitEntity.hasTag('inNet')) {
                hitEntity.runCommand(`ride @s start_riding "${sourceEntity.name}" teleport_rider`);
                sourceEntity.setDynamicProperty('ha:rider', hitEntity.id);
                sourceEntity.setDynamicProperty('ha:evit_firt', true);
                system.runTimeout(() => {
                    if (sourceEntity.hasTag('hasPly')) {
                        hitEntity.runCommand(`ride @s stop_riding`);
                        sourceEntity.setDynamicProperty('ha:rider', "");
                        sourceEntity.setDynamicProperty('ha:evit_firt', true);
                    }
                }, ticksConvertor(2));
            }
        }
    }
    catch { }
});
world.afterEvents.entityHitEntity.subscribe(hitSensor => {
    try {
        const { hitEntity, damagingEntity: sourceEntity } = hitSensor;
        if ((sourceEntity instanceof Player && hitEntity instanceof Player)) {
            if ((!sourceEntity.hasTag('hasPly') && !sourceEntity.hasTag('inNet')) && hitEntity.hasTag('inNet')) {
                sourceEntity.triggerEvent('ha:has_ply');
                hitEntity.runCommand(`ride @s start_riding "${sourceEntity.name}" teleport_rider`);
                sourceEntity.setDynamicProperty('ha:rider', hitEntity.id);
                sourceEntity.setDynamicProperty('ha:evit_firt', true);
                const timerID = system.runTimeout(() => {
                    if (sourceEntity.hasTag('hasPly')) {
                        hitEntity.runCommand(`ride @s stop_riding`);
                        sourceEntity.setDynamicProperty('ha:rider', "");
                        sourceEntity.setDynamicProperty('ha:evit_firt', true);
                    }
                    system.clearRun(timerID);
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
                if (inGlow) {
                    sourceEntity.triggerEvent('ha:remove_glow');
                    hitEntity.triggerEvent('ha:set_glow');
                }
            }
        }
    }
    catch { }
    ;
});
world.afterEvents.playerSpawn.subscribe(spawnSensor => {
    try {
        const { player } = spawnSensor;
        checkSpawnEvents(player);
    }
    catch { }
});
world.afterEvents.itemUse.subscribe(useItems => {
    try {
        const { itemStack: item, source: ply } = useItems;
        if (ply instanceof Player) {
            const armorInv = ply.getComponent(EntityComponentTypes.Equippable);
            const chestItem = armorInv?.getEquipment(EquipmentSlot.Chest);
            if ((chestItem && chestItem.typeId == 'minecraft:elytra') && (item.typeId == 'minecraft:firework_rocket')) {
                elytraSystem(ply);
            }
        }
    }
    catch { }
});
system.afterEvents.scriptEventReceive.subscribe(staticEvents => {
    try {
        const { id, sourceEntity: entity } = staticEvents;
        if (!(entity instanceof Player))
            return;
        if (id == 'ha:tnt_items') {
            const inv = entity.getComponent('inventory')?.container;
            const items = [new ItemStack('ha:tnt_projectile'), new ItemStack('ha:rolling_players'), new ItemStack('ha:super_compass')];
            if (inv) {
                for (let i = 0; i < inv.size; i++) {
                    items[i].lockMode = ItemLockMode.inventory;
                    const item = inv.getItem(i);
                    if (item && item.typeId == items[i].typeId) {
                        continue;
                    }
                    else {
                        inv.addItem(items[i]);
                    }
                }
            }
        }
        else if (id == 'ha:remove_name') {
            entity.nameTag = `§r`;
        }
        else if (id == 'ha:is_attack') {
            const IDRider = entity.getDynamicProperty('ha:rider');
            const isFirtAtk = entity.getDynamicProperty('ha:evit_firt');
            const getRider = world.getAllPlayers().filter(ply => ply.id == IDRider);
            const rider = getRider[0];
            if (isFirtAtk) {
                entity.setDynamicProperty('ha:evit_firt', false);
            }
            else {
                if (rider && entity.hasTag('hasPly')) {
                    const viewCoords = entity.getViewDirection();
                    const horizontalPower = 7;
                    const verticalStrength = 0.75;
                    rider.runCommand(`ride @s stop_riding`);
                    system.runTimeout(() => {
                        const magnitude = Math.sqrt(viewCoords.x * viewCoords.x + viewCoords.z * viewCoords.z);
                        const horizontalForce = {
                            x: (viewCoords.x / magnitude) * horizontalPower,
                            z: (viewCoords.z / magnitude) * horizontalPower
                        };
                        rider.applyKnockback(horizontalForce, verticalStrength);
                        entity.setDynamicProperty('ha:rider', "");
                    }, ticksConvertor(0.15));
                }
            }
        }
    }
    catch { }
});
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
