## Creado o Editado por: HaJuegosCat!. Si editaras o copiaras este archivo, recuerda dejar creditos. Cualquier otra informacion o reporte, en el server de Discord: https://discord.gg/WH9KpNWXUz
## Created or Edited by: HaJuegosCat!. If you edit or copy this file, remember to give credit. For any other information or report, visit the Discord server: https://discord.gg/WH9KpNWXUz

scriptevent ha:tnt_staff

tellraw @a {"rawtext": [{"translate": "chat.gived_tnt", "with": {"rawtext": [{"selector": "@s"}]}}]}

playsound player.gived_tnt @a ~ ~ ~
particle astral:confetti ~ ~0.3 ~

tag @s remove player
tag @s add tntPlayer

event entity @s ha:tntplayer_damage