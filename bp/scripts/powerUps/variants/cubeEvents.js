/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
/**
 * Llamada de los eventos de la variante del Companion Cube.
 * @type {PowerUpBase}
 */
const cubePowerUp = {
    variantID: 12,
    events: {
        allEvents(source) {
            if (source instanceof mc.Player) {
                cubeEvents(source);
            }
        }
    }
};
/**
 * Funcion de los eventos que se ejecutaran cuando se interactue con esta variante
 * @param {mc.Player} ply Jugador en cuestion
 * @returns {void}
 */
function cubeEvents(ply) {
    const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;
    const item = new mc.ItemStack('ha:companion_cube');
    item.lockMode = mc.ItemLockMode.inventory;
    item.setLore(["Hitting a player will eliminate him from the\ngame and take away one point.", "", "Al golpear un jugador, lo eliminara\ndel juego y le quitara un punto."]);
    inv?.addItem(item);
}
export { cubePowerUp };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
