/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */
import * as mc from "@minecraft/server";
import * as ui from "@minecraft/server-ui";
import { addOrRemoveObj, updateTempData } from "./stadisticFn";
/**
 * Muestra la tienda al jugador usando un formulario de acción.
 * @param {mc.Player} ply Jugador en cuestión.
 */
export function showStore(ply) {
    const allTags = ply.getTags();
    const shopItems = getDataItems(0, true);
    const objCoins = mc.world.scoreboard.getObjective('totalPoints');
    const totalCoins = objCoins?.getScore(ply) ?? 0;
    const items = [
        { key: "item.trident.name", texture: "textures/items/trident", tag: shopItems[0].tag, price: getDynamicPrice(shopItems[0].count, totalCoins) },
        { key: "item.ha:wing", texture: "textures/items/wing_item", tag: shopItems[1].tag, price: getDynamicPrice(shopItems[1].count, totalCoins) },
        { key: "item.wind_charge.name", texture: "textures/items/wind_charge", tag: shopItems[2].tag, price: getDynamicPrice(shopItems[2].count, totalCoins), totalItems: "x3 " },
        { key: "item.fishing_rod.name", texture: "textures/items/fishing_rod_uncast", tag: shopItems[3].tag, price: getDynamicPrice(shopItems[3].count, totalCoins) },
        { key: "item.ha:net_gun", texture: "textures/items/net_gun", tag: shopItems[4].tag, price: getDynamicPrice(shopItems[4].count, totalCoins), totalItems: "x3 " },
        { key: "potion.invisibility.name", texture: "textures/items/potion_bottle_splash_invisibility", tag: shopItems[5].tag, price: getDynamicPrice(shopItems[5].count, totalCoins) },
        { key: "item.ender_pearl.name", texture: "textures/items/ender_pearl", tag: shopItems[6].tag, price: getDynamicPrice(shopItems[6].count, totalCoins) },
        { key: "item.ha:coin", texture: "textures/items/coin_item", tag: shopItems[7].tag, price: getDynamicPrice(shopItems[7].count, totalCoins) },
        { key: "potion.turtleMaster.name", texture: "textures/items/potion_bottle_splash_turtleMaster", tag: shopItems[8].tag, price: getDynamicPrice(shopItems[8].count, totalCoins) },
        { key: "item.ha:companion_cube", texture: "textures/items/companion_cube", tag: shopItems[9].tag, price: getDynamicPrice(shopItems[9].count, totalCoins) }
    ];
    const formUI = new ui.ActionFormData()
        .title({ translate: "ui.shop.title" })
        .body({ translate: "ui.shop.body" });
    items.forEach((item, i) => {
        const hasItem = allTags.includes(item.tag);
        formUI.button({
            translate: "ui.shop.item_template_name", with: {
                rawtext: [
                    {
                        translate: hasItem ? "ui.shop.hasItem" : "§r"
                    },
                    {
                        translate: hasItem ? "§r" : "ui.shop.item_name", with: {
                            rawtext: [{ text: "\n" }, { translate: item.key }, { translate: `${item.price}` }, { text: item.totalItems ? `${item.totalItems}` : "§r" }]
                        }
                    }
                ]
            }
        }, item.texture);
    });
    // @ts-ignore
    formUI.show(ply).then(r => {
        if (r.canceled || typeof r.selection != "number")
            return;
        shopManage(ply, r.selection, totalCoins);
    });
}
/**
 * Maneja la selección y transacción de la tienda con el jugador.
 * @param {mc.Player} ply Jugador en cuestión.
 * @param {number} selection Selección del jugador.
 * @param {number} playerPoints Puntos actuales del jugador.
 */
function shopManage(ply, selection, playerPoints) {
    const item = getDataItems(selection);
    const allTags = ply.getTags();
    const objCoins = mc.world.scoreboard.getObjective('totalPoints');
    const totalCoins = typeof playerPoints == "number" ? playerPoints : (objCoins?.getScore(ply) ?? 0);
    const dynamicPrice = getDynamicPrice(item.count, totalCoins);
    if (allTags.some(t => t == item.tag)) {
        ply.sendMessage({ translate: "chat.error_shop.hasitem" });
        ply.playSound('ui.powerup.in_cooldown');
        return;
    }
    if (totalCoins < dynamicPrice) {
        ply.sendMessage({ translate: "chat.error_shop.nocoins" });
        ply.playSound('ui.powerup.in_cooldown');
        return;
    }
    ply.addTag(item.tag);
    ply.sendMessage({ translate: "chat.shop.getitem", with: { rawtext: [{ translate: `${item.selection}` }] } });
    ply.playSound(item.isGolden ? "ui.shop.buy_max" : "ui.shop.buy_min");
    objCoins?.addScore(ply, -dynamicPrice);
    addOrRemoveObj(ply, 'totalShop', 1);
    updateTempData(ply);
}
/**
 * Calcula el precio dinámico de un item basado en los puntos del jugador usando un sistema escalonado. El precio se ajusta de manera más justa para todos los rangos de puntos.
 * @param {number} basePrice Precio base del item.
 * @param {number} playerPoints Puntos actuales del jugador.
 * @returns {number} Precio ajustado.
 */
function getDynamicPrice(basePrice, playerPoints) {
    if (playerPoints <= basePrice * 2) {
        return basePrice;
    }
    const wealthRatio = playerPoints / basePrice;
    let priceMultiplier = 1;
    // Escalón 1: 2x-5x precio base -> hasta 1.5x precio
    if (wealthRatio <= 5) {
        const progress = (wealthRatio - 2) / 3; // 0 a 1
        priceMultiplier = 1 + (progress * 0.5); // 1x a 1.5x
    }
    else if (wealthRatio <= 15) { // Escalón 2: 5x-15x precio base -> hasta 3x precio  
        const progress = (wealthRatio - 5) / 10; // 0 a 1
        priceMultiplier = 1.5 + (progress * 1.5); // 1.5x a 3x
    }
    else if (wealthRatio <= 30) { // Escalón 3: 15x-30x precio base -> hasta 6x precio
        const progress = (wealthRatio - 15) / 15; // 0 a 1
        priceMultiplier = 3 + (progress * 3); // 3x a 6x
    }
    else if (wealthRatio <= 60) { // Escalón 4: 30x-60x precio base -> hasta 12x precio
        const progress = (wealthRatio - 30) / 30; // 0 a 1
        priceMultiplier = 6 + (progress * 6); // 6x a 12x
    }
    else if (wealthRatio <= 120) { // Escalón 5: 60x-120x precio base -> hasta 25x precio
        const progress = (wealthRatio - 60) / 60; // 0 a 1
        priceMultiplier = 12 + (progress * 13); // 12x a 25x
    }
    else { // Escalón 6: Más de 120x -> Crecimiento exponencial limitado
        const excessRatio = wealthRatio - 120;
        const exponentialGrowth = Math.sqrt(excessRatio / 10); // Raíz cuadrada para suavizar
        priceMultiplier = 25 + exponentialGrowth * 15; // Mínimo 25x, puede llegar a mucho más
        // Límite máximo
        priceMultiplier = Math.min(priceMultiplier, 100);
    }
    return Math.round(basePrice * priceMultiplier);
}
/**
 * Funcion que devuevle los datos de los items disponibles de la tienda.
 * @param {number} selection (Opcional, por defecto 0) Seleccion del Jugador.
 * @param {boolean} getAllVar (Opcional, por defecto false) Obtener todo el array.
 * @returns {ShopItem | ListOfShopItems} Datos del item o todos los items.
 */
function getDataItems(selection = 0, getAllVar = false) {
    const shopItems = {
        0: { tag: "tridentShop", selection: "item.trident.name", count: 50, isGolden: false, item: new mc.ItemStack('minecraft:trident', 1) },
        1: { tag: "wingShop", selection: "item.ha:wing", count: 100, isGolden: false, item: new mc.ItemStack('ha:wing', 1) },
        2: { tag: "chargeShop", selection: "item.wind_charge.name", count: 100, isGolden: false, item: new mc.ItemStack('minecraft:wind_charge', 3) },
        3: { tag: "rodShop", selection: "item.fishing_rod.name", count: 150, isGolden: false, item: new mc.ItemStack('minecraft:fishing_rod', 1) },
        4: { tag: "gunShop", selection: "item.ha:net_gun", count: 200, isGolden: false, item: new mc.ItemStack('ha:net_gun', 3) },
        5: { tag: "inviShop", selection: "potion.invisibility.name", count: 300, isGolden: true, item: `give @s splash_potion 1 7 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}` },
        6: { tag: "pearlShop", selection: "item.ender_pearl.name", count: 350, isGolden: true, item: new mc.ItemStack('minecraft:ender_pearl', 1) },
        7: { tag: "coinShop", selection: "item.ha:coin", count: 400, isGolden: true, item: new mc.ItemStack('ha:coin', 1) },
        8: { tag: "turtleShop", selection: "potion.turtleMaster.name", count: 500, isGolden: true, item: `give @s splash_potion 1 39 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}` },
        9: { tag: "cubeShop", selection: "item.ha:companion_cube", count: 1000, isGolden: true, item: new mc.ItemStack('ha:companion_cube', 1) }
    };
    return getAllVar ? shopItems : shopItems[selection];
}
/**
 * Funcion que da los items a los jugadores que compraron items.
 * @param {mc.Player} ply Jugador en cuestion.
 * @returns {void}
 */
export function getItemsFromShop(ply) {
    const allTags = ply.getTags();
    const inv = ply.getComponent(mc.EntityComponentTypes.Inventory)?.container;
    const allData = getDataItems(0, true);
    for (const key in allData) {
        const shopItem = allData[key];
        if (allTags.includes(shopItem.tag)) {
            if (typeof shopItem.item == "string") {
                ply.runCommand(shopItem.item);
            }
            else if (inv) {
                const item = shopItem.item;
                item.lockMode = mc.ItemLockMode.inventory;
                inv.addItem(item);
            }
            ply.removeTag(shopItem.tag);
        }
    }
}
/* Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz */
/* Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz */ 
