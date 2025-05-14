/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { ItemCustomComponent } from "@minecraft/server";

import { coinEvent } from "./customComponents/coinItem";
import { tntEvent } from "./customComponents/tntItem";
import { rollingEvent } from "./customComponents/rollingItem";
import { compassEvent } from "./customComponents/compassItem";
import { wingEvent } from "./customComponents/wingItem";
import { cubeEvent } from "./customComponents/cubeItem";
import { calculatorEvent } from "./customComponents/calculatorItem";

/**
 * Lista de componentes custom.
 * @type {CustomComponentBase[]}
 */
export const listOfComponents: CustomComponentBase[] = [
    coinEvent,
    tntEvent,
    rollingEvent,
    compassEvent,
    wingEvent,
    cubeEvent,
    calculatorEvent,
];

export interface CustomComponentBase {
    name: string;
    events: ItemCustomComponent;
}

/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */