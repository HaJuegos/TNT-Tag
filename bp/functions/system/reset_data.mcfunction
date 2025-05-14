
tp 2031.84 52.36 -1967.97

gamemode a

tellraw @s {"rawtext": [{ "translate": "chat.endgame_return" }]}
playsound mob.wither.break_block

tag @s remove tntPly
tag @s remove normalPly
tag @s remove spectMode
tag @s remove inNet
tag @s remove activatedCoin

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

## Creado o Editado por: HaJuegosCat!. Si editas o copias este archivo, recuerda dejar créditos. Para cualquier otra información o reporte, visita el servidor de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz