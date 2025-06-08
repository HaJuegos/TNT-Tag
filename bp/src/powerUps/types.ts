/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import * as mc from "@minecraft/server";

import { coinPowerUp } from "./variants/coinEvents";
import { blindEvent } from "./variants/blindEvents";
import { inviEvent } from "./variants/invisibilityEvents";
import { bowArrowEvent } from "./variants/bowArrowEvents";
import { JumpBoostEvent } from "./variants/jumpBoostEvents";
import { speedEvent } from "./variants/speedEvents";
import { wingEvent } from "./variants/wingEvents";
import { clockEvent } from "./variants/clockEvents";
import { slowEvent } from "./variants/slowEvents";
import { elytraEvent } from "./variants/elytraEvents";
import { gunEvent } from "./variants/gunEvents";
import { cubePowerUp } from "./variants/cubeEvents";
import magnetEvent from "./variants/magnetEvents";
import brokenClockEvents from "./variants/brokenClockEvents";

/**
 * Lista de eventos de los powerUps.
 * @type {Record<number, PowerUpBase>}
 */
export const listOfPowerUps: Record<number, PowerUpBase> = {
    [coinPowerUp.variantID]: coinPowerUp,
    [blindEvent.variantID]: blindEvent,
    [inviEvent.variantID]: inviEvent,
    [bowArrowEvent.variantID]: bowArrowEvent,
    [JumpBoostEvent.variantID]: JumpBoostEvent,
    [speedEvent.variantID]: speedEvent,
    [wingEvent.variantID]: wingEvent,
    [clockEvent.variantID]: clockEvent,
    [slowEvent.variantID]: slowEvent,
    [elytraEvent.variantID]: elytraEvent,
    [gunEvent.variantID]: gunEvent,
    [cubePowerUp.variantID]: cubePowerUp,
    [magnetEvent.variantID]: magnetEvent,
    [brokenClockEvents.variantID]: brokenClockEvents,
};

export interface PowerUpBase {
    /**
     * ID del powerup.
     * @type {number}
     */
    variantID: number;

    /**
     * (Opcional, default = 5) Un cooldown especifico por powerup.
     * @type {?number}
     */
    cooldownPowerUp?: number;

    /**
     * (Opcional, default = 10) Un cooldown especifico para el jugador con quien interactuo.
     * @type {?number}
     */
    cooldownPly?: number;

    /**
     * Lista de eventos al interactuar con este mob.
     * */
    events: {
        /**
         * (Opcional) Eventos que solo pasan con jugadores con la TNT.
         * @type {?(source: mc.Entity | mc.Player) => void | boolean}
         */
        onlyTntEvents?: (source: mc.Entity | mc.Player) => void | boolean;

        /**
         * (Opcional) Eventos que solo pasan con jugadores sin la TNT.
         * @type {?(source: mc.Entity | mc.Player) => void | boolean}
         */
        onlyPlyEvents?: (source: mc.Entity | mc.Player) => void | boolean;

        /**
         * (Opcional) Eventos que pasan con todos los jugadores.
         * @type {?(source: mc.Entity | mc.Player) => void | boolean}
         */
        allEvents?: (source: mc.Entity | mc.Player) => void | boolean;

        /**
         * (Opcional) Especificar que no se aplica cooldown al powerup y el jugador.
         */
        noCooldown?: {
            tnt?: boolean;
            plys?: boolean;
            all?: boolean;
        };
    };

    /**
     * (Opcional) Especificar un cooldown para varios jugadores.
     */
    specificCooldown?: {
        allTntPlys?: boolean;
        allNormalPlys?: boolean;
        all?: boolean;
    };
}

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */