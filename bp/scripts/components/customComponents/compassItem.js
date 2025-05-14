/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Eventos que pasan para el componente del Super Compass.
 * @type {CustomComponentBase}
 */
const compassEvent = {
    name: 'ha:compass_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            const item = new mc.ItemStack('ha:super_compass');
            if (!(ply instanceof mc.Player))
                return;
            if (checkGlowActivated()) {
                ply.playSound('ui.powerup.in_cooldown');
                ply.sendMessage({ translate: "chat.coin_cooldown" });
            }
            else {
                addAllCooldown(item);
                glowEvent(ply);
            }
        }
    }
};
/**
 * Funcion que revisa si ya esta activado el glowing para evitar repeticiones.
 * @returns {boolean} Devuelve true si ya esta activo, false en caso de que no.
 */
function checkGlowActivated() {
    const entities = mc.world.getDimension('overworld').getEntities({ type: 'ha:glowing_entity', tags: ["glowActivated"] });
    if (entities.length > 0) {
        return true;
    }
    return false;
}
/**
 * Funcion encargada del item del Glowing.
 * @param {mc.Player} sourcePly Jugador que inicio el evento.
 * @returns {Void}
 */
function glowEvent(sourcePly) {
    const coords = sourcePly.location;
    const dime = sourcePly.dimension;
    const plys = mc.world.getAllPlayers().filter(ply => !ply.hasTag('spectMode') && !ply.hasTag('tntPly'));
    const obj = mc.world.scoreboard.getObjective('timerGlow');
    const entity = dime.spawnEntity('ha:glowing_entity', coords);
    entity.addTag('glowActivated');
    obj?.addScore(entity, 20);
    for (const ply of plys) {
        ply.triggerEvent('ha:set_glow');
        if (ply.hasTag('activatedCoin')) {
            ply.nameTag = `§e§l[COIN ACTIVATED]§r\n${ply.name}`;
            ply.triggerEvent('ha:remove_glow');
        }
        else {
            ply.nameTag = `${ply.name}`;
        }
    }
    mc.world.sendMessage({ translate: "chat.compass_activated" });
    sourcePly.runCommand(`time set midnight`);
    sourcePly.runCommand(`execute as @a at @s run playsound player.compass_used`);
}
/**
 * Añade un cooldown de un item a todos los Jugadores.
 * @param {mc.ItemStack} item Item en cuestion.
 * @returns {void}
 */
function addAllCooldown(item) {
    const cooldown = item.getComponent('cooldown');
    for (const ply of mc.world.getAllPlayers()) {
        cooldown?.startCooldown(ply);
    }
}
export { compassEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
