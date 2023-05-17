## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

execute as @e[type=ha:setup,scores={lobbyj=..1}] run tellraw @a {"rawtext": [{"translate":"message.error_party"}]}
execute as @e[type=ha:setup,scores={lobbyj=..1}] run playsound mob.wither.break_block @a

execute as @e[type=ha:setup,scores={lobbyj=2..}] run fill 191 7 205 195 3 209 air destroy

execute as @e[type=ha:setup,scores={lobbyj=2..}] run event entity @s ha:start_party_alt

execute as @e[type=ha:setup,scores={lobbyj=2..}] run execute as @a[m=survival] run tag @s add victim
execute as @e[type=ha:setup,scores={lobbyj=2..}] run execute as @a[m=adventure] run tag @s add victim

execute as @e[type=ha:setup,scores={lobbyj=2..}] run scoreboard objectives add randoms dummy
execute as @e[type=ha:setup,scores={lobbyj=2..}] run scoreboard players random @e[type=ha:setup] randoms 1 2

execute as @e[type=ha:setup,scores={lobbyj=2..}] run execute as @e[type=ha:setup,scores={randoms=1}] run tp @a[tag=victim] 15 -60 -75
execute as @e[type=ha:setup,scores={lobbyj=2..}] run execute as @e[type=ha:setup,scores={randoms=2}] run tp @a[tag=victim] 26 -41 30

execute as @e[type=ha:setup,scores={lobbyj=2..}] run stopsound @a ambient.lobby_music
execute as @e[type=ha:setup,scores={lobbyj=2..}] run playsound record.pandora_palace @a

execute as @e[type=ha:setup,scores={lobbyj=2..}] run scoreboard objectives setdisplay sidebar
execute as @e[type=ha:setup,scores={lobbyj=2..}] run scoreboard objectives setdisplay list