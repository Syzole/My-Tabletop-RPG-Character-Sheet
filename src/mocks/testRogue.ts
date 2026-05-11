import * as Items from "@/types/item";
import { Character } from "../types/character";
import { DamageType } from "@/types/damage";
import { WeaponProperties } from "@/types/weapon";
import { armorType } from "@/types/armor";
import { featureType, rechargeType } from "@/types/feature";
import { itemRarity } from "@/types/item";
import { AttackType } from "@/types/damage";
import { WeaponCategories, Weapons } from "@/types/weapon";
import { classes } from "@/constants/character";
import { defaultSpeed } from "@/types/speed";
import { species } from "@/data/species";
import { resolveSpecies } from "@/utils/species";

export const testRogue: Character = {
	name: "Corivar",
	playerName: "Syzole",
	race: resolveSpecies("Elf", {subspecies: "High Elf"})!,
	background: "Criminal / Spy",
	alignment: "Chaotic Neutral",
	class: "Rogue",
	level: 3,
	experiencePoints: 900,

	baseStats: {
		strength: 9,
		dexterity: 15,
		constitution: 13,
		intelligence: 14,
		wisdom: 13,
		charisma: 10,
	},
	proficiencyBonus: 2,
	inspiration: false,
	savingThrows: {
		strength: "none",
		constitution: "none",
		dexterity: "proficient",
		intelligence: "none",
		wisdom: "none",
		charisma: "proficient",
	},

	skills: {
		athletics: { stat: "strength", proficient: "none" },
		acrobatics: { stat: "dexterity", proficient: "proficient" },
		sleightOfHand: { stat: "dexterity", proficient: "proficient" },
		stealth: { stat: "dexterity", proficient: "expertise" },
		arcana: { stat: "intelligence", proficient: "none" },
		history: { stat: "intelligence", proficient: "none" },
		investigation: { stat: "intelligence", proficient: "proficient" },
		nature: { stat: "intelligence", proficient: "none" },
		religion: { stat: "intelligence", proficient: "none" },
		animalHandling: { stat: "wisdom", proficient: "none" },
		insight: { stat: "wisdom", proficient: "proficient" },
		medicine: { stat: "wisdom", proficient: "none" },
		perception: { stat: "wisdom", proficient: "proficient" },
		survival: { stat: "wisdom", proficient: "none" },
		deception: { stat: "charisma", proficient: "proficient" },
		intimidation: { stat: "charisma", proficient: "none" },
		performance: { stat: "charisma", proficient: "none" },
		persuasion: { stat: "charisma", proficient: "halfProficient" },
	},

	speed: defaultSpeed,
	proficiencies: {
		armor: new Set([armorType.Light]),
		weapons: new Set([WeaponCategories.Simple, Weapons.CrossbowHand, Weapons.Longsword, Weapons.Rapier, Weapons.Shortsword, Weapons.Shortbow]),
		tools: new Set(["thieves' tools", "disguise kit"]),
		languages: new Set(["Common", "Elvish", "Thieves' Cant"]),
	},

	hitPoints: {
		current: 18,
		max: 18,
		temporary: 0,
	},

	deathSaves: {
		successes: 0,
		failures: 0,
		isStabilized: false,
	},

	hitDice: {
		d8: {
			total: 3,
			used: 0,
		},
	},

	equipment: {
		Rapier: {
			attackType: AttackType.Melee,
			weaponType: Weapons.Rapier,
			category: WeaponCategories.Martial,
			weight: 2,
			description: ["A slender, sharply pointed sword."],
			damage: {
				diceCount: 1,
				diceValue: 8,
				type: DamageType.Piercing,
			},
			quantity: 1,
			equipped: true,
			rarity: itemRarity.Common,
			requiresAttunement: false,
			properties: new Set([WeaponProperties.Finesse, WeaponProperties.Versatile]),
		} as Items.Weapon,
		Shortbow: {
			attackType: AttackType.Ranged,
			weaponType: Weapons.Shortbow,
			category: WeaponCategories.Simple,
			range: {
				normal: 80,
				long: 320,
			},
			weight: 2,
			description: ["A small bow for ranged attacks."],
			damage: {
				diceCount: 1,
				diceValue: 6,
				type: DamageType.Piercing,
			},
			quantity: 1,
			equipped: true,
			rarity: itemRarity.Common,
			requiresAttunement: false,
			properties: new Set([WeaponProperties.Ammunition, WeaponProperties.TwoHanded, WeaponProperties.Loading]),
		} as Items.Weapon,
		Dagger: {
			attackType: AttackType.Melee,
			weaponType: Weapons.Dagger,
			category: WeaponCategories.Simple,
			weight: 1,
			description: ["A small blade."],
			damage: {
				diceCount: 1,
				diceValue: 4,
				type: DamageType.Piercing,
			},
			range: {
				normal: 20,
				long: 60,
			},
			quantity: 2,
			equipped: true,
			rarity: itemRarity.Common,
			requiresAttunement: false,
			properties: new Set([WeaponProperties.Finesse, WeaponProperties.Light, WeaponProperties.Thrown]),
		} as Items.Weapon,
		"Leather Armor": {
			armorClass: 11,
			weight: 10,
			type: armorType.Light,
			quantity: 1,
			equipped: true,
			rarity: itemRarity.Common,
		} as Items.Armor,
		"Thieves' Tools": {
			toolType: "thieves' tools",
			weight: 1,
			description: ["Used for lockpicking and disarming traps."],
			quantity: 1,
			
			rarity: itemRarity.Common,
			requiresAttunement: false,
		} as Items.Tool,
		"Disguise Kit": {
			toolType: "disguise kit",
			weight: 3,
			description: ["Used to create disguises."],
			quantity: 1,
			
			rarity: itemRarity.Common,
			requiresAttunement: false,
		} as Items.Tool,
		Backpack: {
			weight: 5,
			description: ["A sturdy backpack."],
			quantity: 1,
			
			rarity: itemRarity.Common,
			requiresAttunement: false,
		},
		Crowbar: {
			weight: 5,
			description: ["A metal crowbar."],
			quantity: 1,
			
			rarity: itemRarity.Common,
			requiresAttunement: false,
		},
		"Set of Dark Common Clothes": {
			weight: 3,
			description: ["Dark clothing for blending in."],
			quantity: 1,
		
			rarity: itemRarity.Common,
			requiresAttunement: false,
		},
	},

	armor: {
		armorClass: 11,
		weight: 10,
		type: armorType.Light,
		quantity: 1,
		equipped: true,
		rarity: itemRarity.Common,
		stealthDisadvantage: false,
		maxDexBonus: undefined,
		strengthRequirement: undefined,
	},

	currency: {
		copper: 15,
		silver: 8,
		electrum: 0,
		gold: 12,
		platinum: 0,
	},

	personalityTraits: ["I always have a plan for what to do when things go wrong."],
	ideals: ["Freedom. Chains are meant to be broken, as are those who would forge them."],
	bonds: ["I'm trying to pay off an old debt I owe to a generous benefactor."],
	flaws: ["When I see something valuable, I can't think about anything but how to steal it."],

	features: {
		Darkvision: { name: "Darkvision", type: featureType.Passive, description: "Can see in dim light within 60 feet as if it were bright light.", source: "Race" },
		"Keen Senses": { name: "Keen Senses", type: featureType.Passive, description: "Proficiency in the Perception skill.", source: "Race" },
		"Fey Ancestry": { name: "Fey Ancestry", type: featureType.Passive, description: "Advantage on saving throws against being charmed.", source: "Race" },
		Trance: { name: "Trance", type: featureType.Passive, description: "Meditate deeply for 4 hours instead of sleeping.", source: "Race" },
		"Sneak Attack (2d6)": {
			name: "Sneak Attack (2d6)",
			type: featureType.Other,
			description: "Extra damage when attacking with advantage or when an ally is within 5 feet.",
			damage: { diceCount: 2, diceValue: 6, type: DamageType.Slashing },
			source: classes.rogue,
		},
		"Cunning Action": { name: "Cunning Action", type: featureType.BonusAction, description: "Take a bonus action to Dash, Disengage, or Hide.", source: classes.rogue },
		"Thieves' Cant": { name: "Thieves' Cant", type: featureType.Passive, description: "Secret language of thieves.", source: classes.rogue },
		"Fast Hands": {
			name: "Fast Hands",
			type: featureType.BonusAction,
			description:
				"Starting at 3rd level, you can use the bonus action granted by your Cunning Action to make a Dexterity (Sleight of Hand) check, use your thieves' tools to disarm a trap or open a lock, or take the Use an Object action.",
			source: classes.rogue,
		},
		"Second-Story Work": {
			name: "Second-Story Work",
			type: featureType.Passive,
			description:
				"When you choose this archetype at 3rd level, you gain the ability to climb faster than normal; climbing no longer costs you extra movement. In addition, when you make a running jump, the distance you cover increases by a number of feet equal to your Dexterity modifier.",
			source: classes.rogue,
		},
		"Steady Aim": {
			name: "Steady Aim",
			type: featureType.BonusAction,
			description:
				"As a bonus action, you give yourself advantage on your next attack roll on the current turn. You can use this bonus action only if you haven't moved during this turn, and after you use the bonus action, your speed is 0 until the end of the current turn.",
			source: classes.rogue,
		},
		Archery: {
			name: "Archery",
			type: featureType.Passive,
			description: "You have advantage on attack rolls against targets that are not within 5 feet of you. You gain a +2 bonus to attack rolls you make with ranged weapons.",
			source: "Feat",
			modifiers: [{ target: "attackRoll", value: 2, condition: { attackType: "ranged" } }],
		},
		Lucky: {
			name: "Lucky",
			type: featureType.Other,
			description: "Up to 3 times per long rest, you can reroll a failed ability check, attack roll, or saving throw. You must use the new roll, even if it is lower.",
			source: "Feat",
			charges: 3,
			chargesUsed: 0,
			recharge: rechargeType.Long,
		},
	},

	//featuresTraits: ["Darkvision", "Keen Senses", "Fey Ancestry", "Trance", "Sneak Attack (2d6)", "Cunning Action", "Thieves' Cant", "Fast Hands", "Second-Story Work", "Steady Aim"],
};


//save the character to a file
// fs.writeFileSync("testRogue.json", JSON.stringify(testRogue, null, 2));