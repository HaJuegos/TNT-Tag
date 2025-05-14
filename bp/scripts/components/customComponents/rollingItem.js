/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Eventos que pasan para el componente del Rolling.
 * @type {CustomComponentBase}
 */
const rollingEvent = {
    name: 'ha:rolling_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            const item = new mc.ItemStack('ha:rolling_players');
            if (!(ply instanceof mc.Player))
                return;
            if (rollingPlys()) {
                addAllCooldown(item);
                ply.runCommand(`execute as @a at @s run playsound player.random_teleport.start`);
                mc.world.sendMessage({ translate: "chat.rolling_players" });
            }
            else {
                ply.playSound('ui.powerup.in_cooldown');
                ply.sendMessage({ translate: "chat.error_noplayers" });
            }
        }
    }
};
/**
 * Funcion encargada de intercambiar posiciones entre Jugadores de forma aleatoria.
 * @returns {boolean} Devuelve true en caso de que todo hay salido bien, y false en caso contrario.
 */
function rollingPlys() {
    const plys = mc.world.getAllPlayers().filter(ply => !ply.hasTag('spectMode'));
    if (plys.length < 2) {
        return false;
    }
    const plyPositions = plys.map(ply => ({ ply: ply, coords: ply.location, viewCoords: ply.getViewDirection() }));
    const copyPositions = [...plyPositions];
    for (let i = copyPositions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copyPositions[i], copyPositions[j]] = [copyPositions[j], copyPositions[i]];
    }
    let inPosition = true;
    for (let i = 0; i < plys.length; i++) {
        if (plyPositions[i].ply.id == copyPositions[i].ply.id) {
            inPosition = false;
            break;
        }
    }
    if (!inPosition) {
        return rollingPlys();
    }
    for (let i = 0; i < plys.length; i++) {
        const ply = plyPositions[i].ply;
        const coords = copyPositions[i].coords;
        const viewCoords = copyPositions[i].viewCoords;
        ply.teleport(coords, { facingLocation: viewCoords });
    }
    return true;
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
export { rollingEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
