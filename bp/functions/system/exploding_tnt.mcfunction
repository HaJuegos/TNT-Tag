## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

scoreboard players set @s totalInGame 46

execute as @a[tag=tntPlayer] at @s run particle minecraft:knockback_roar_particle ~~0.5~
execute as @a[tag=tntPlayer] at @s run playsound random.explode @a ~~~

execute as @a[tag=tntPlayer] at @s run gamemode spectator
execute as @a[tag=tntPlayer] at @s run playsound ui.tnt_exploding
execute as @a[tag=tntPlayer] at @s run titleraw @s title {"rawtext": [{"translate": "ui.tnt_exploding"}]}
execute as @a[tag=tntPlayer] at @s run titleraw @s subtitle {"rawtext": [{"translate": "ui.tnt_exploding_sub"}]}
execute as @a[tag=tntPlayer] at @s run tellraw @s {"rawtext": [{"translate": "chat.dead_player"}]}
execute as @a[tag=tntPlayer] at @s run tellraw @a {"rawtext": [{"translate": "chat.alert_dead_player", "with": {"rawtext": [{"selector": "@s"}]}}]}
execute as @a[tag=tntPlayer] at @s run playsound ui.kaboom
execute as @a[tag=tntPlayer] at @s run camera @s fade time 0 0.8 1.5 color 255 255 255
execute as @a[tag=tntPlayer] at @s run clear @s
execute as @a[tag=tntPlayer] at @s run tag @s remove tntPlayer

scriptevent ha:set_data_ded