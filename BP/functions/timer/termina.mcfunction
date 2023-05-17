## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

execute as @a[tag=tnt_player] run tellraw @a {"rawtext": [{"translate":"message.end_gameover", "with": {"rawtext": [{"selector":"@s"}]}}]}

playsound ambient.weather.thunder @a

execute as @a[tag=tnt_player] run tag @s add kill
execute as @a[tag=tnt_player] run tag @s add spect
execute as @a[tag=tnt_player] run clear @s

function system/asign_rol

tag @e[type=ha:setup] remove norepeat

execute as @e[type=ha:setup] run function timer/set_timer