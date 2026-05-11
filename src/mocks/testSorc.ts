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
import { exampleSorcererSpellcasting, exampleWizardSpellcasting } from "./testSpellcasting";
import { species } from "@/data/species";
import { defaultSpeed } from "@/types/speed";

export const testSorc: Character = {
	name: "Corivar",
	playerName: "Syzole",
	race: species["High Elf"],
	background: "Criminal / Spy",
	alignment: "Chaotic Neutral",
	class: "Sorcerer",
	level: 1,
	experiencePoints: 0,

	baseStats:{
        strength: 8,
        dexterity: 13,
        constitution: 14,
        intelligence: 12,
        wisdom: 10,
        charisma: 15,
    },
    proficiencyBonus: 2,
    inspiration: false,
    savingThrows: {
        strength: "none",
        dexterity: "proficient",
        constitution: "proficient",
        intelligence: "none",
        wisdom: "proficient",
        charisma: "proficient",
    },
    skills: {
        athletics: { stat: "strength", proficient: "proficient" },
		acrobatics: { stat: "dexterity", proficient: "none" },
		sleightOfHand: { stat: "dexterity", proficient: "none" },
		stealth: { stat: "dexterity", proficient: "proficient" },
		arcana: { stat: "intelligence", proficient: "none" },
		history: { stat: "intelligence", proficient: "none" },
		investigation: { stat: "intelligence", proficient: "none" },
		nature: { stat: "intelligence", proficient: "none" },
		religion: { stat: "intelligence", proficient: "none" },
		animalHandling: { stat: "wisdom", proficient: "none" },
		insight: { stat: "wisdom", proficient: "none" },
		medicine: { stat: "wisdom", proficient: "none" },
		perception: { stat: "wisdom", proficient: "proficient" },
		survival: { stat: "wisdom", proficient: "none" },
		deception: { stat: "charisma", proficient: "proficient" },
		intimidation: { stat: "charisma", proficient: "proficient" },
		performance: { stat: "charisma", proficient: "none" },
		persuasion: { stat: "charisma", proficient: "none" },
    },

    speed: defaultSpeed,
    proficiencies:{
        armor: new Set(),
        weapons: new Set([Weapons.CrossbowLight, Weapons.Dagger, Weapons.Dart, Weapons.Quarterstaff, Weapons.Sling]),
        tools: new Set(["Dice Set", "Thieves' Tools"]),
        languages: new Set(["Common", "Draconic", "Netherese", "Sespech"]),
    },

    hitPoints: {
        current: 9,
        max: 9,
        temporary: 0,
    },

    deathSaves: {
		successes: 0,
		failures: 0,
		isStabilized: false,
	},

    hitDice: {
        d6:{
            total: 1,
            used: 0,
        }
    },

    equipment: {
        "Crossbow Bolts": {
            effect: "Ammunition for crossbow, light",
            uses: 20,
            maxUses: 20,
            quantity: 20,
            consumableType: "ammunition",
            weight: 1.5,
            value: 1,
            rarity: itemRarity.Common,
            tags: ["Damage", "Combat"],
        } as Items.Consumable,
        "Crossbow, Light": {
            attackType: AttackType.Ranged,
            weaponType: Weapons.CrossbowLight,
            category: WeaponCategories.Simple,
            range: { normal: 80, long: 320 },
            weight: 5,
            damage: {
                diceCount: 1,
                diceValue: 8,
                type: DamageType.Piercing,
            },
            quantity: 1,
            equipped: true,
            value: 25,
            rarity: itemRarity.Common,
            properties: new Set([
                WeaponProperties.Ammunition,
                WeaponProperties.Loading,
                WeaponProperties.Range,
                WeaponProperties.TwoHanded,
            ]),
        } as Items.Weapon,
        Dagger: {
            attackType: AttackType.Melee,
            weaponType: Weapons.Dagger,
            category: WeaponCategories.Simple,
            weight: 1,
            damage: {
                diceCount: 1,
                diceValue: 4,
                type: DamageType.Piercing,
            },
            range: { normal: 20, long: 60 },
            quantity: 2,
            equipped: true,
            value: 2,
            rarity: itemRarity.Common,
            properties: new Set([
                WeaponProperties.Finesse,
                WeaponProperties.Light,
                WeaponProperties.Thrown,
            ]),
        } as Items.Weapon,
        Rod: {
            name: "Rod",
            itemType: "rod",
            weight: 2,
            quantity: 1,
            value: 10,
            rarity: itemRarity.Common,
            tags: ["Utility"],
        } as Items.WondrousItem,
        Backpack: {
            name: "Backpack",
            weight: 5,
            quantity: 1,
            capacity: 30,
            rarity: itemRarity.Common,
            containedItems: new Set([
                {
                    name: "Bedroll",
                    weight: 7,
                    quantity: 1,
                    value: 1,
                    rarity: itemRarity.Common,
                    tags: ["Utility"],
                },
                {
                    name: "Mess Kit",
                    weight: 1,
                    quantity: 1,
                    value: 0.2,
                    rarity: itemRarity.Common,
                    tags: ["Social", "Utility"],
                },
                {
                    name: "Rations (1 day)",
                    weight: 2,
                    quantity: 10,
                    value: 5,
                    rarity: itemRarity.Common,
                    tags: ["Social", "Utility", "Consumable"],
                },
                {
                    name: "Rope, Hempen (50 feet)",
                    weight: 10,
                    quantity: 1,
                    value: 1,
                    rarity: itemRarity.Common,
                    tags: ["Utility", "Exploration"],
                },
                {
                    name: "Tinderbox",
                    weight: 1,
                    quantity: 1,
                    value: 0.5,
                    rarity: itemRarity.Common,
                    tags: ["Utility", "Exploration"],
                },
                {
                    name: "Torch",
                    weight: 1,
                    quantity: 10,
                    value: 0.1,
                    rarity: itemRarity.Common,
                    tags: ["Damage", "Utility", "Exploration", "Combat"],
                },
                {
                    name: "Waterskin",
                    weight: 5,
                    quantity: 1,
                    value: 0.2,
                    rarity: itemRarity.Common,
                    tags: ["Container"],
                },
            ]),
        } as Items.Container,
    },

    currency: {
        copper: 0,
        silver: 0,
        electrum: 0,
        gold: 0,
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
        "Trance": { name: "Trance", type: featureType.Passive, description: "Meditate deeply for 4 hours instead of sleeping.", source: "Race" },
        "Spellcasting": { name: "Spellcasting", type: featureType.Passive, description: "You have the ability to cast spells.", source: classes.sorcerer },
        "Dragonic Resilience": { name: "Dragonic Resilience", type: featureType.Passive, description: "You have resistance to the damage type associated with your draconic ancestry.", source: classes.sorcerer },
        "Dragon Ancestor": { name: "Dragon Ancestor", type: featureType.Passive, description: "You can speak, read, and write Draconic. Additionally, whenever you make a Charisma check when interacting with dragons, your proficiency bonus is doubled if it applies to the check.", source: classes.sorcerer },
    },

    spellcasting: {
        spells: exampleSorcererSpellcasting.spells,
        leveledSlots: exampleSorcererSpellcasting.leveledSlots
    }
};
