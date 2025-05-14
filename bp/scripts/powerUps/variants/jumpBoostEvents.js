/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import { ticksConvertor } from "../../globalVariables";
/**
 * Llamada de los eventos de la variante JumpBoost.
 * @type {PowerUpBase}
 */
const JumpBoostEvent = {
    variantID: 5,
    events: {
        allEvents(source) {
            source.addEffect("jump_boost", ticksConvertor(10), { amplifier: 3 });
        }
    }
};
export { JumpBoostEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
