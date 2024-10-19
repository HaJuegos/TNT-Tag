## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

particle ha:cube_particle ~~1~
particle ha:cube_particle ~~1~
particle ha:deleted_particle ~~1~
playsound mob.companion.damage @a ~~~

gamemode spectator
titleraw @s title {"rawtext": [{"translate": "ui.cube_damage"}]}
titleraw @s subtitle {"rawtext": [{"translate": "ui.cube_damage_sub"}]}
tellraw @s {"rawtext": [{"translate": "chat.dead_player"}]}
tellraw @a {"rawtext": [{"translate": "chat.alert_dead_player_cube", "with": {"rawtext": [{"selector": "@s"}]}}]}

camera @s fade time 0 0.8 1.5 color 174 125 184
clear @s
tag @s remove tntPlayer
tag @s remove player

scoreboard players remove @s winStack 1