/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, world } from "@minecraft/server";

import { handlePowerUpEvents } from "./types";

world.afterEvents.entityHitEntity.subscribe(hitEvents => {
    try {
        const { hitEntity, damagingEntity: sourceEntity } = hitEvents;

        if (hitEntity.typeId == 'ha:power_ups' && sourceEntity instanceof Player) {
            const variant = hitEntity.getComponent('variant')?.value;

            if (variant != 0 && variant) {
                handlePowerUpEvents(variant, sourceEntity, hitEntity);
            }
        }
    } catch {}
});

world.afterEvents.playerInteractWithEntity.subscribe(interactEvents => {
    try {
        const { player: ply, target: entity } = interactEvents;

        if (entity.typeId == 'ha:power_ups') {
            const variant = entity.getComponent('variant')?.value;

            if (variant != 0 && variant) {
                handlePowerUpEvents(variant, ply, entity);
            }
        }
    } catch {}
});

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */