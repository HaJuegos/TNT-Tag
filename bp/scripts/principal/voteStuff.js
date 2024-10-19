/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { Player, system } from "@minecraft/server";

import { ticksConvertor } from "./worldStart";
import { beforeStartParty, endVotations, initVotations, loopCalculator, reselectSpectificPlayers, setTNTStuff, showUIVotations, startEndGame, startVotations } from "../functions/voteFunctions";

system.afterEvents.scriptEventReceive.subscribe(votationEvents => {
    try {
        const { id, sourceEntity: player } = votationEvents;
        const eventActions = {
            'ha:starting_votation': initVotations,
            'ha:ending_votation': endVotations,
            'ha:voting': () => {
                if (player instanceof Player) {
                    showUIVotations(player);
                };
            },
            'ha:check_players': beforeStartParty,
            'ha:reselect_tntplayers': reselectSpectificPlayers,
            'ha:tnt_staff': () => {
                if (player instanceof Player) {
                    setTNTStuff(player);
                };
            },
            'ha:end_game_name': startEndGame
        };
        const action = eventActions[id];

        if (action) action();
    } catch {};
});

system.runInterval(/** @param {Void} _addCalculatorVote */ _addCalculatorVote => {
    try {
        if (!startVotations) return;

        loopCalculator();
    } catch {};
}, ticksConvertor(0.75));
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */