
title @s title §r

tag @s remove tntPly
tag @s add normalPly

event entity @s ha:player_damage

replaceitem entity @s slot.armor.head 0 air

playsound mob.zombie.unfect @s

clear @s ha:tnt_projectile
clear @s ha:rolling_players
clear @s ha:super_compass

## Creado o Editado por: HaJuegosCat!. Si editas o copias este archivo, recuerda dejar créditos. Para cualquier otra información o reporte, visita el servidor de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz