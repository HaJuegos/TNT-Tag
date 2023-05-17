## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

event entity @e ha:forced_despawn

scoreboard players reset @e[type=ha:setup] jugadores

tp @a 200 2 200

titleraw @a times 10 70 10
execute as @a[tag=tnt_player] run titleraw @a title {"rawtext": [{"translate":"title.win_message", "with": {"rawtext": [{"selector":"@s"}]}}]}
execute as @a[tag=tnt_player] run titleraw @a subtitle {"rawtext": [{"translate":"title.win_message_2"}]}
execute as @a[tag=!tnt_player] run titleraw @a actionbar {"rawtext": [{"translate":"title.lose_message"}]}
execute as @a[tag=!tnt_player] run playsound random.screenshot @s
execute as @a[tag=tnt_player] run playsound ui.win_game @s
execute as @a[tag=tnt_player] run scoreboard players add @s winsteak 1
execute as @a[tag=tnt_player] run particle astral:confetti ~ ~ ~
execute as @a[tag=tnt_player] run tag @s remove tnt_player
titleraw @a reset

event entity @e ha:instant_despawn
scoreboard players reset @e[type=ha:setup] *
execute as @r run summon ha:setup ~ ~10 ~

gamemode a @a[tag=spect]

tag @e remove ingame
tag @a remove victim
tag @a remove spect
tag @a remove cooldown
tag @a remove coinactivate
effect @a clear
clear @a

scoreboard objectives setdisplay sidebar winsteak descending
scoreboard objectives setdisplay list winsteak descending

event entity @a ha:stop_music

structure load lobby_start 191 3 205

playsound ambient.lobby_music @a