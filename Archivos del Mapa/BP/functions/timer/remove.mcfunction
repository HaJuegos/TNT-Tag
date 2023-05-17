## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

scoreboard players remove @s m 1

execute as @s[tag=!norepeat,scores={s=0,m=..0}] run scoreboard players set @s m 59
execute as @s[tag=!norepeat,scores={s=0,m=59}] run tag @s add norepeat

execute as @s[scores={m=!..9}] run scoreboard players reset @s mm
execute as @s[scores={m=..9}] run scoreboard players set @s mm 0

execute as @s[scores={s=!..9}] run scoreboard players reset @s ss
execute as @s[scores={s=..9}] run scoreboard players set @s ss 0

execute as @s[scores={m=..0,mm=..0,s=1..}] run scoreboard players remove @s s 1
execute as @s[scores={m=..0,mm=..0,s=1..}] run scoreboard players set @s m 59

execute as @s[tag=norepeat,scores={s=0,m=..-1}] run function timer/termina