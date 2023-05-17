## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

scoreboard objectives add randonge dummy

scoreboard players random @s randonge 0 5

execute as @s[scores={randonge=0}] run summon ha:blindness_boost "§0§lBlindness§r"
execute as @s[scores={randonge=1}] run summon ha:bowandarrow_boost "§c§lBow & Arrow§r"
execute as @s[scores={randonge=2}] run summon ha:coin_boost "§e§lCoin§r"
execute as @s[scores={randonge=3}] run summon ha:invisibility_boost "§7§lInvisibility§r"
execute as @s[scores={randonge=4}] run summon ha:jump_boost "§a§lJump Boost§r"
execute as @s[scores={randonge=5}] run summon ha:speed_boost "§b§lSpeed§r"