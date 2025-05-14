/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
/**
 * Variable con los valores de los mapas
 * @type {MapsList[]}
 */
const maps = [
    { id: 'random', scoreID: 'random', translate: 'chat.random' },
    { id: '1', scoreID: 'map1', translate: 'chat.voted1' },
    { id: '2', scoreID: 'map2', translate: 'chat.voted2' },
    { id: '3', scoreID: 'map3', translate: 'chat.voted3' },
    { id: '4', scoreID: 'map4', translate: 'chat.voted4' },
    { id: '5', scoreID: 'map5', translate: 'chat.voted5' },
    { id: '6', scoreID: 'map6', translate: 'chat.voted6' },
    { id: '7', scoreID: 'map7', translate: 'chat.voted7' },
    { id: '8', scoreID: 'map8', translate: 'chat.voted8' },
    { id: '9', scoreID: 'map9', translate: 'chat.voted9' },
    { id: '10', scoreID: 'map10', translate: 'chat.voted10' },
];
/**
 * Eventos que pasan para el componente de la calculator.
 * @type {CustomComponentBase}
 */
const calculatorEvent = {
    name: 'ha:calculator_events',
    events: {
        onUse(arg) {
            const { source: ply } = arg;
            const item = new mc.ItemStack('ha:calculator');
            if (!(ply instanceof mc.Player))
                return;
            if (ply.hasTag('alrVoted')) {
                ply.sendMessage({ translate: "chat.yep_voting" });
                ply.playSound('ui.powerup.in_cooldown');
                return;
            }
            else {
                startCooldown(item, ply);
                calculatorVotes(ply);
            }
        }
    }
};
/**
 * Eventos que se ejecutan cuando el item es usado.
 * @param {mc.Player} ply Jugador en cuestión.
 * @returns {void}
 */
function calculatorVotes(ply) {
    const votations = new ui.ActionFormData()
        .title({ translate: "ui.votation_time" })
        .body({ translate: "ui.votation_choose" });
    maps.forEach(map => {
        votations.button({ translate: map.id === 'random' ? 'ui.button_random' : `ui.button_vote${map.id}` }, `textures/ui/custom/map_icons/${map.id === 'random' ? 'random' : 'map' + map.id}`);
    });
    // @ts-ignore
    votations.show(ply).then(async (r) => {
        if (r.canceled || r.selection == undefined)
            return;
        const mapSelected = maps[r.selection];
        const mapID = mapSelected.id;
        const needsWarning = (mapID == '1' || mapID == 'random');
        if (needsWarning) {
            const accepted = await showVoteWarning(ply, mapID);
            if (!accepted) {
                calculatorVotes(ply);
                return;
            }
            ;
        }
        registerVote(ply, mapSelected);
    });
}
/**
 * Muestra la advertencia si el jugador vota por mapa 1 o random.
 * @param {mc.Player} ply Jugador que vota
 * @param {string} mapID ID del mapa seleccionado
 * @returns {Promise<boolean>} True si el jugador acepta, False si cancela o dice "No"
 */
async function showVoteWarning(ply, mapID) {
    const warningUI = new ui.ActionFormData()
        .title({ translate: "ui.warning_vote_1" })
        .body({ translate: mapID == 'random' ? "ui.warning_voterandom_text" : "ui.warning_vote_text" })
        .button({ translate: "ui.warning.buttonyes" })
        .button({ translate: "ui.warning.buttonno" });
    // @ts-ignore
    return warningUI.show(ply).then(resp => {
        return !resp.canceled && resp.selection == 0;
    });
}
/**
 * Registra el voto del jugador por el mapa seleccionado.
 * @param {mc.Player} ply Jugador que vota
 * @param {any} mapSelected Objeto del mapa seleccionado
 */
function registerVote(ply, mapSelected) {
    const obj1 = mc.world.scoreboard.getObjective('totalVotes');
    const obj2 = mc.world.scoreboard.getObjective('totalVotesView');
    const mapID = mapSelected.id;
    const scoreKey = mapSelected.scoreID;
    if (mapID == 'random') {
        obj2?.addScore('score.random', 1);
        obj1?.addScore('map.random', 1);
    }
    else {
        obj2?.addScore(`score.${scoreKey}`, 1);
        obj1?.addScore(`map.${mapID}`, 1);
    }
    ply.sendMessage({ translate: `${mapSelected.translate}` });
    ply.playSound('random.levelup');
    ply.addTag('alrVoted');
}
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
export { calculatorEvent };
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
