/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { Player } from "@minecraft/server";
import { ticksConvertor } from "../../globalVariables";
/**
 * Llamada de los eventos de la variante del Invisibility.
 * @type {PowerUpBase}
 */
const inviEvent = {
    variantID: 3,
    events: {
        onlyTntEvents(source) {
            if (source instanceof Player) {
                source.sendMessage({ translate: "chat.no_coin_activate" });
                source.playSound('ui.powerup.in_cooldown');
            }
        },
        onlyPlyEvents(source) {
            source.addEffect("invisibility", ticksConvertor(10), { showParticles: true });
        },
        noCooldown: {
            tnt: true
        }
    }
};
export { inviEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
