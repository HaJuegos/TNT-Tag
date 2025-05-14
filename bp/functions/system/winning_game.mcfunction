
titleraw @a title {"rawtext": [{ "translate": "ui.wininng" }]}
titleraw @a subtitle {"rawtext": [{ "translate": "ui.wininng_sub", "with": {"rawtext": [{ "selector": "@s" }]} }]}

tellraw @a {"rawtext": [{ "translate": "chat.winning_player", "with": {"rawtext": [{ "selector": "@s" }]} }]}

execute as @a at @s run playsound ui.winning_game

particle astral:confetti ~ ~0.3 ~
particle astral:confetti ~ ~0.3 ~
particle astral:confetti ~ ~0.3 ~

scoreboard players add @s winStack 1

tag @s remove tntPly
tag @s remove normalPly
tag @s remove spectMode
gamemode a
clear @a

## Creado o Editado por: HaJuegosCat!. Si editas o copias este archivo, recuerda dejar créditos. Para cualquier otra información o reporte, visita el servidor de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz