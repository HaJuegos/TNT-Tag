## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

tellraw @a {"rawtext": [{"translate": "chat.winning_player", "with": {"rawtext": [{"selector": "@s"}]}}]}
titleraw @a subtitle {"rawtext": [{"translate": "ui.wininng_sub", "with": {"rawtext": [{"selector": "@s"}]}}]}
titleraw @a title {"rawtext": [{"translate": "ui.wininng"}]}

particle astral:confetti ~ ~0.3 ~
particle astral:confetti ~ ~0.3 ~
particle astral:confetti ~ ~0.3 ~

execute as @a at @s run playsound ui.winning_game

event entity @e[type=ha:sensor] ha:despawn

scoreboard players reset * totalVotes