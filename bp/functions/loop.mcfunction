## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz
 
execute as @a[hasitem={item=ha:coin_item,location=slot.weapon.mainhand}] at @s run scriptevent ha:set_lore
execute as @a[hasitem={item=ha:wing_item,location=slot.weapon.mainhand}] at @s run scriptevent ha:set_lore_two
 
tag @a[m=spectator] add spect
tag @a[m=c] add spect
 
tag @a[m=s] remove spect
tag @a[m=a] remove spect