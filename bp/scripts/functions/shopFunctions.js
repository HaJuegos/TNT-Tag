/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */

import { ItemLockMode, ItemStack, Player, system } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

import { getSpecificEntities, scoreboard, ticksConvertor } from "../principal/worldStart";

const shopUI = new ActionFormData().title({ translate: "ui.shop.title" }).body({ translate: "ui.shop.body" })
    .button({ translate: "ui.shop.item1", with: { rawtext: [{ text: `\n` }, { translate: "item.trident.name" }] } }, "textures/items/trident")
    .button({ translate: "ui.shop.item2", with: { rawtext: [{ text: `\n` }, { translate: "item.ha:wing_item" }] } }, "textures/items/wing_item")
    .button({ translate: "ui.shop.item3", with: { rawtext: [{ text: `\n` }, { translate: "item.wind_charge.name" }] } }, "textures/items/wind_charge")
    .button({ translate: "ui.shop.item4", with: { rawtext: [{ text: `\n` }, { translate: "item.fishing_rod.name" }] } }, "textures/items/fishing_rod_uncast")
    .button({ translate: "ui.shop.item5", with: { rawtext: [{ text: `\n` }, { translate: "item.ha:net_gun" }] } }, "textures/items/net_gun")
    .button({ translate: "ui.shop.item6", with: { rawtext: [{ text: `\n` }, { translate: "potion.invisibility.name" }] } }, "textures/items/potion_bottle_splash_invisibility")
    .button({ translate: "ui.shop.item7", with: { rawtext: [{ text: `\n` }, { translate: "item.ender_pearl.name" }] } }, "textures/items/ender_pearl")
    .button({ translate: "ui.shop.item8", with: { rawtext: [{ text: `\n` }, { translate: "item.ha:coin_item" }] } }, "textures/items/coin_item")
    .button({ translate: "ui.shop.item9", with: { rawtext: [{ text: `\n` }, { translate: "potion.turtleMaster.name" }] } }, "textures/items/potion_bottle_splash_turtleMaster")
    .button({ translate: "ui.shop.item10", with: { rawtext: [{ text: `\n` }, { translate: "item.ha:companion_cube" }] } }, "textures/items/companion_cube");


/**
 * Datos temporales del jugador, organizados por nombre de jugador.
 * @type {Object.<string, { coins: number; dedTotal: number; winTotal: number; state: string; gameTime: string; totalShop: number; totalVotes: number; tntPass: number; }>}
 */
export let plyTempData = {};

/**
 * Objecto que guarda los valores establecidos para los items especificos.
 * @type {Object.<number, {tag: string, selection: string, count: number, isGolden: boolean, item: ItemStack | String }>}
 */
const tagsSelection = {
    0: { tag: "tridentShop", selection: "item.trident.name", count: 50, isGolden: false, item: new ItemStack('minecraft:trident', 1) },
    1: { tag: "wingShop", selection: "item.ha:wing_item", count: 100, isGolden: false, item: new ItemStack('ha:wing_item', 1) },
    2: { tag: "chargeShop", selection: "item.wind_charge.name", count: 100, isGolden: false, item: new ItemStack('minecraft:wind_charge', 1) },
    3: { tag: "rodShop", selection: "item.fishing_rod.name", count: 150, isGolden: false, item: new ItemStack('minecraft:fishing_rod', 1) },
    4: { tag: "gunShop", selection: "item.ha:net_gun", count: 200, isGolden: false, item: new ItemStack('ha:net_gun', 3) },
    5: { tag: "inviShop", selection: "potion.invisibility.name", count: 300, isGolden: true, item: `give @s splash_potion 1 7 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}` },
    6: { tag: "pearlShop", selection: "item.ender_pearl.name", count: 350, isGolden: true, item: new ItemStack('minecraft:ender_pearl', 1) },
    7: { tag: "coinShop", selection: "item.ha:coin_item", count: 400, isGolden: true, item: new ItemStack('ha:coin_item', 1) },
    8: { tag: "turtleShop", selection: "potion.turtleMaster.name", count: 500, isGolden: true, item: `give @s splash_potion 1 39 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}` },
    9: { tag: "cubeShop", selection: "item.ha:companion_cube", count: 1000, isGolden: true, item: new ItemStack('ha:companion_cube', 1) }
};

/**
 * Muestra y controla el UI de la tienda de memo.
 * @param {Player} ply Jugador que inicio el UI.
 * @returns {Void}
 */
export function UIShopManager(ply) {
    system.runTimeout(() => {
        // @ts-ignore
        const isShowed = shopUI.show(ply);

        isShowed.then(r => {
            if (r.canceled) return;

            shopManagerSelector(ply, r.selection);
        });
    }, ticksConvertor(0.35));
};

/**
 * Acciones a tomar cuando se elija algo en la tienda.
 * @param {Number | undefined} selection Eleccion en general, desde 0 a ....
 * @param {Player} ply Jugador que selecciono la opcion.
 * @returns {Void}
 */
function shopManagerSelector(ply, selection) {
    // @ts-ignore
    const finalSelect = tagsSelection[selection];
    const idSound = (finalSelect.isGolden) ? "ui.getcoin.max" : "ui.getcoin.mini";
    const allTags = ply.getTags();
    const obj = scoreboard.getObjective('coinsPlys');
    const actualCoins = obj?.getScore(ply) || 0;

    if (allTags.find(t => t.includes(finalSelect.tag))) {
        ply.sendMessage({ translate: "chat.error_shop.hasitem" });
        ply.playSound("ui.error_blocked");
    } else if (actualCoins < finalSelect.count) {
        ply.sendMessage({ translate: "chat.error_shop.nocoins" });
        ply.playSound("ui.error_blocked");
    } else {
        ply.addTag(finalSelect.tag);
        ply.sendMessage({ translate: "chat.shop.getitem", with: { rawtext: [{ translate: `${finalSelect.selection}` }] } });
        ply.playSound(idSound);
        obj?.addScore(ply, -finalSelect.count);
        addDataTemp(ply, 1, false, false, false, true);
    };
};

/**
 * verifica y agrega el item que compraron en la tienda al momento de iniciar una partida.
 * @returns {Void}
 */
export function checkItemsShop() {
    for (const ply of getSpecificEntities({ type: 'minecraft:player' })) {
        if (!(ply instanceof Player)) continue;
        const inv = ply.getComponent('inventory')?.container;

        for (const key in tagsSelection) {
            const { tag, item } = tagsSelection[key];

            if (!ply.hasTag(tag)) continue;

            ply.removeTag(tag);

            if (item instanceof ItemStack) {
                item.lockMode = ItemLockMode.inventory;

                inv?.addItem(item);
            } else {
                ply.runCommand(item);
            };
        };
    };
};

/**
 * Al ejecutar esta funcion, muestra un menu de informacion del jugador.
 * @param {Player} ply Jugador en cuestion
 * @returns {Void}
 */
export function statisticsPlys(ply) {
    if (!plyTempData[ply.name]) {
        plyTempData[ply.name] = {
            coins: scoreboard.getObjective('coinsPlys')?.getScore(ply) ?? 0,
            dedTotal: 0,
            winTotal: 0,
            state: ['ui.statec1', 'ui.statec2', 'ui.statec3', 'ui.statec4', 'ui.statec5'][Math.floor(Math.random() * 4)],
            totalShop: 0,
            totalVotes: 0,
            gameTime: new Date().toLocaleTimeString(),
            tntPass: 0
        };
    };

    const data = plyTempData[ply.name];

    const statsUI = new ActionFormData()
        .title({ translate: "ui.statsply.title", with: { rawtext: [{ text: `${ply.name}` }] } })
        .body({ translate: "ui.statsply.body", with: { rawtext: [{ text: `\n` }, { text: `${data.coins}` }, { text: `${data.dedTotal}` }, { text: `${data.winTotal}` }, { translate: `${data.state}` }, { text: `${data.gameTime}` }, { text: `${data.totalShop}` }, { text: `${data.totalVotes}` }, { text: `${data.tntPass}` }] } })
        .button({ translate: "ui.statsply.end" });

    // @ts-ignore
    statsUI.show(ply);
};

/**
 * Agrega un valor al objecto con los datos temporales.
 * @param {Player} ply Jugador al que se le agrega el valor.
 * @param {Number} newValue Valor a agregar.
 * @param {Boolean} isCoins ¿Actualizar monedas?
 * @param {Boolean} isDed ¿Actualizar derrotas?
 * @param {Boolean} isWin ¿Actualizar victorias?
 * @param {Boolean} isShop ¿Actualizar compras?
 * @param {Boolean} isVotes ¿Actualizar votos?
 * @param {Boolean} isTntPass ¿Actualizar pase de tnt?
 */
export function addDataTemp(ply, newValue, isCoins = true, isDed = false, isWin = false, isShop = false, isVotes = false, isTntPass = false) {
    const playerData = plyTempData[ply.name] ??= {
        coins: scoreboard.getObjective('coinsPlys')?.getScore(ply) ?? 0,
        dedTotal: 0,
        winTotal: 0,
        state: ['ui.statec1', 'ui.statec2', 'ui.statec3', 'ui.statec4', 'ui.statec5'][Math.floor(Math.random() * 4)],
        totalShop: 0,
        totalVotes: 0,
        gameTime: new Date().toLocaleTimeString(),
        tntPass: 0
    };

    if (isCoins || !isCoins) playerData.coins = scoreboard.getObjective('coinsPlys')?.getScore(ply) ?? 0;
    if (isDed) playerData.dedTotal += newValue;
    if (isWin) playerData.winTotal += newValue;
    if (isShop) playerData.totalShop += newValue;
    if (isVotes) playerData.totalVotes += newValue;
    if (isVotes) playerData.totalVotes += newValue;
    if (isTntPass) playerData.tntPass += newValue;
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */