## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

effect @a saturation 1 100 true

gamerule commandblockoutput false
gamerule doimmediaterespawn true
gamerule pvp true
gamerule keepinventory true
gamerule showbordereffect false
gamerule showcoordinates true
gamerule showtags false
gamerule spawnradius 0
gamerule dotiledrops false

execute as @a[m=spectator] run tag @s remove victim
execute as @a[m=creative] run tag @s remove victim

effect @a resistance 1 100 true

execute as @e[type=ha:setup,tag=ingame,scores={jugadores=..0}] run function tnt_game/termina
execute as @e[type=ha:setup,tag=ingame,scores={cazadores=2..}] run event entity @r[tag=tnt_player,c=1] ha:tnt_pass