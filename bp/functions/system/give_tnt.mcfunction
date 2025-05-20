
title @s title §r

tag @s remove normalPly
tag @s add tntPly

playsound player.conffetti @a ~~~
particle astral:confetti ~~0.35~

event entity @s ha:tnt_player_damage

tellraw @a {"rawtext": [{ "translate": "chat.gived_tnt", "with": {"rawtext": [{ "selector": "@s" }] } }]}

replaceitem entity @s slot.armor.head 0 ha:tnt_helmet 1 0 {"minecraft:item_lock":{"mode":"lock_in_slot"}}
scriptevent ha:tnt_items

## Creado o Editado por: HaJuegosCat!. Si editas o copias este archivo, recuerda dejar créditos. Para cualquier otra información o reporte, visita el servidor de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz