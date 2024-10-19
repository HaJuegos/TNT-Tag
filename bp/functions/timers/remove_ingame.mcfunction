## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

execute as @s[tag=ingame] at @s run titleraw @a actionbar {"rawtext": [{"translate": "ui.ingametimer", "with": {"rawtext": [{"score": {"name": "@s", "objective": "totalInGame"}}]}}]}
execute as @s[tag=ingame] at @s run playsound random.click @a

scoreboard players remove @s[tag=ingame] totalInGame 1