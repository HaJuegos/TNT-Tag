## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

tellraw @s {"rawtext": [{"translate": "chat.endgame_return"}]}

tp 2031.92 53.47 -1967.37
gamemode a
tag @s remove spect
tag @s remove player
tag @s remove tntPlayer
clear @s
clear @s
effect @s clear
effect @s clear
effect @s saturation 999999 100 true
event entity @a ha:return_normal_damage

function music/1