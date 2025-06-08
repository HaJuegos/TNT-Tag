/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
import { addOrRemoveObj } from "../../functions/stadisticFn";
/**
 * Eventos que pasan para el componente de la net gun.
 * @type {CustomComponentBase}
 */
const gunEvent = {
    name: 'ha:net_gun_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            const item = new mc.ItemStack('ha:net_gun');
            if (!(ply instanceof mc.Player))
                return;
            startCooldown(item, ply);
            addOrRemoveObj(ply, 'totalPoints', Math.floor(Math.random() * 3) + 1);
        }
    }
};
/**
 * Funcion encargada de iniciar el cooldown del item al jugador que lo uso.
 * @param {mc.ItemStack} item Item en cuestion
 * @param {mc.Player} ply Jugador en cuestion
 * @returns {Void}
 */
function startCooldown(item, ply) {
    const cooldown = item.getComponent('cooldown');
    cooldown?.startCooldown(ply);
}
export { gunEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
