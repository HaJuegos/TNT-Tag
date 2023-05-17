## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

playsound random.levelup @s
clear @s

replaceitem entity @s slot.hotbar 0 shield 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}

tellraw @s {"rawtext": [{"translate":"player_damage.message_alive"}]}

effect @s blindness 0 0
effect @s speed 0 0
effect @s slowness 0 0

tag @s remove tnt_player
tag @s add victim