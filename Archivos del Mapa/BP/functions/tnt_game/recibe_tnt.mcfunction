## Creado/Editado por: HaJuegos Cat!. Si necesitas mas informacion, escribeme en Discord: https://discord.com/users/714622708649951272
## Created/Edited by: HaCatto! If you need more information, write me on Discord: https://discord.com/users/714622708649951272

playsound mob.evocation_illager.ambient @s
playsound ui.conffetti_use @a ~ ~ ~
particle astral:confetti ~ ~ ~
playsound random.levelup @a ~ ~ ~ 900 2

tellraw @s {"rawtext": [{"translate":"player_damage.message"}]}
tellraw @a {"rawtext": [{"translate":"player_damager.message", "with": {"rawtext": [{"selector":"@s"}]}}]}

clear @s

replaceitem entity @s slot.armor.head 0 ha:tnt_helmet 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}
replaceitem entity @s slot.hotbar 2 fishing_rod 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}
replaceitem entity @s slot.hotbar 0 ha:detector 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}
replaceitem entity @s slot.hotbar 1 diamond_axe 1 0 {"minecraft:item_lock":{"mode":"lock_in_inventory"}}

effect @s slowness 0 0
effect @s blindness 0 0
effect @s speed 99999 1

tag @s remove victim
tag @s add tnt_player