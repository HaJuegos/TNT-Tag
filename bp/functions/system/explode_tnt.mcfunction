
gamemode spectator
particle minecraft:knockback_roar_particle ~~0.5~
playsound player.tnt_explode
playsound random.explode @a ~~~

titleraw @s title {"rawtext": [{ "translate": "ui.tnt_exploding" }]}
titleraw @s subtitle {"rawtext": [{ "translate": "ui.tnt_exploding_sub" }]}

tellraw @a {"rawtext": [{ "translate": "chat.alert_dead_player", "with": {"rawtext": [{ "selector": "@s" }]} }]}

tellraw @s {"rawtext": [{ "translate": "chat.dead_player" }]}

camera @s fade time 0 0.8 1.5 color 255 255 255
clear @s

tag @s remove tntPly
tag @s add spectMode
tag @s remove inNet

event entity @s ha:remove_solid_mode
event entity @s ha:in_lobby
event entity @s ha:remove_glow
event entity @s ha:remove_net
event entity @s ha:set_normal_box

scoreboard players reset @s timerCoin
scoreboard players reset @s cooldownPower
scoreboard players reset @s timerGlow
scoreboard players reset @s timerNet

clear @s
effect @s clear
camera @s clear
inputpermission set @s movement enabled
inputpermission set @s jump enabled
inputpermission set @s sneak enabled

scriptevent ha:remove_name

## Creado o Editado por: HaJuegosCat!. Si editas o copias este archivo, recuerda dejar créditos. Para cualquier otra información o reporte, visita el servidor de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz