## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

scoreboard objectives setdisplay sidebar winStack descending
execute as @a[tag=player] at @s run scoreboard players add @s winStack 1
clear @a
tag @a remove player
tag @a remove tntPlayer
effect @a clear
effect @a clear
effect @a saturation 999999 100 true
event entity @a ha:remove_glowing
event entity @a ha:lobby_damage
scriptevent ha:end_game_name
gamemode a @a[tag=!admin]
execute as @a at @s run tp 2031.92 53.47 -1967.37
scoreboard players reset * totalAllPlayers
summon ha:sensor 2031 52 -1969

tag @a remove map1
tag @a remove map2
tag @a remove map3
tag @a remove map4
tag @a remove map5
tag @a remove map6
tag @a remove map7
tag @a remove map8
tag @a remove map9
tag @a remove map10

scoreboard players reset * totalVotes

give @a ha:info_player 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}