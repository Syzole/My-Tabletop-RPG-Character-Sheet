import { armorType } from "@/types/armor";
import { AttackType, DamageType } from "@/types/damage";
import { featureType, rechargeType } from "@/types/feature";
import * as Items from "@/types/item";
import { itemRarity } from "@/types/item";
import { WeaponCategories, WeaponProperties, Weapons } from "@/types/weapon";
import { Character } from "../types/character";
import { classes } from "@/constants/character";
import { exampleMulticlassSpellcasting } from "./testSpellcasting";
import { resolveSpecies } from "@/utils/species";
import { Speed } from "@/types/speed";

export const testSorc: Character = {
	name: "Nephemis",
	playerName: "Syzole",
	race: resolveSpecies("Elf", {subspecies: "Drow"})!,
	background: "Criminal / Spy",
	alignment: "Chaotic Neutral",
	class: "Sorcerer / Warlock", //TODO: make Class type array
	level: 4, //Sorceror 3, Warlock 1

	baseStats:{
        strength: 10,
        dexterity: 13,
        constitution: 14,
        intelligence: 9,
        wisdom: 12,
        charisma: 17,
    },
    proficiencyBonus: 2,
    inspiration: false,
    savingThrows: {
        strength: "none",
        dexterity: "none",
        constitution: "proficient",
        intelligence: "none",
        wisdom: "none",
        charisma: "proficient",
    },
    skills: {
        acrobatics: { stat: "dexterity", proficient: "none" },
        animalHandling: { stat: "wisdom", proficient: "proficient" },
        arcana: { stat: "intelligence", proficient: "proficient" },
        athletics: { stat: "strength", proficient: "none" },
        deception: { stat: "charisma", proficient: "none" },
        history: { stat: "intelligence", proficient: "none" },
        insight: { stat: "wisdom", proficient: "proficient" },
        intimidation: { stat: "charisma", proficient: "none" },
        investigation: { stat: "intelligence", proficient: "none" },
        medicine: { stat: "wisdom", proficient: "none" },
        nature: { stat: "intelligence", proficient: "none" },
        perception: { stat: "wisdom", proficient: "none" },
        performance: { stat: "charisma", proficient: "none" },
        persuasion: { stat: "charisma", proficient: "proficient" },
        religion: { stat: "intelligence", proficient: "proficient" },
        sleightOfHand: { stat: "dexterity", proficient: "none" },
        stealth: { stat: "dexterity", proficient: "none" },
        survival: { stat: "wisdom", proficient: "none" },
    },

    speed: {
        walk: 30,
    } as Speed,


    proficiencies:{
        armor: new Set<armorType>([armorType.Light]),
        weapons: new Set([WeaponCategories.Simple]),
        tools: new Set(["Calligrapher's Supplies"]),
        languages: new Set(["Common", "Goblin", "Orc"]),
    },

    hitPoints: {
        current: 30,
        max: 30,
        temporary: 0,
    },

    deathSaves: {
		successes: 0,
		failures: 0,
		isStabilized: false,
	},

    hitDice: {
        d6:{
            total: 3,
            used: 0,
        },
        d8:{
            total: 1,
            used: 0,
        }
    },

    equipment: {
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
        Crystal: {
            name: "Crystal",
            itemType: "Arcane Focus",
            weight: 2,
            quantity: 1,
            value: 10,
            rarity: itemRarity.Common,
            tags: ["Utility"],
        } as Items.Item,
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
        "Innate Sorcery": { name: "Innate Sorcery", type: featureType.BonusAction, description: "An event in your past left an indelible mark on you, infusing you with simmering magic. As a Bonus Action, you can unleash that magic for 1 minute, during which you gain the following benefits:\nThe spell save DC of your Sorcerer spells increases by 1.\nYou have Advantage on the attack rolls of Sorcerer spells you cast.\nYou can use this feature twice, and you regain all expended uses of it when you finish a Long Rest.", source: classes.sorcerer, charges: 2, recharge: rechargeType.Long, chargesUsed: 0 },
        "Eldritch Invocations":{ name: "Eldritch Invocations", type: featureType.Passive, description: "You have unearthed Eldritch Invocations, pieces of forbidden knowledge that imbue you with an abiding magical ability or other lessons.", source: classes.warlock},
        "Pact Magic":{ name: "Pact Magic", type: featureType.Passive, description: "You have made a pact with a fiend to unleash destructive energy on your enemies. Your patron gives you tremendous power as payment.", source: classes.warlock},
    },

    spellcasting: {
        spells: exampleMulticlassSpellcasting.spells,
        leveledSlots: exampleMulticlassSpellcasting.leveledSlots,
        pactSlots: exampleMulticlassSpellcasting.pactSlots,
    }
};
