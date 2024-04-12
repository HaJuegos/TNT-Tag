## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

execute as @e[type=ha:votation_timer] at @s run titleraw @a actionbar {"rawtext": [{"translate": "ui.votation_timer", "with": {"rawtext": [{"score":{"name": "@s","objective": "loopVotations"}}]}}]}
execute as @a at @s run playsound random.click @s ~ ~ ~ 50.0 2.0

scoreboard players remove @s loopVotations 1