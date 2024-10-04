// utils.ts

import DnDCharacter from "./DnDCharacter";

import { Armor, Item, ProficiencyLevel, SavingThrowProficiencyLevel, skills, Stats } from "./types";

import { martialMelee, martialRanged, simpleMelee, simpleRanged } from "./definitions";

export function getProficientWeapons(character: DnDCharacter) {
	const allWeapons = simpleMelee.concat(simpleRanged, martialMelee, martialRanged);
	return allWeapons.filter((weapon) => character.proficiencies.weapons.includes(weapon));
}

export function calculateAttackBonus(character: DnDCharacter, weapon: string) {
	const proficientWeapons = getProficientWeapons(character);
	const isProficient = proficientWeapons.includes(weapon);

	//return higher between dex and str if weapon is finesse
	const abilityModifier = weapon === "Finesse" ? Math.max(character.stats.str, character.stats.dex) : character.stats.str;

	if (isProficient) {
		return character.proficiencyBonus + abilityModifier;
	} else {
		return abilityModifier;
	}
}

export function calculateSkillModifier(character: DnDCharacter, skill: keyof skills): number {
	const statModifier = getStatModifierForSkill(character, skill);
	let modifier = statModifier;

	switch (character.skills[ skill ].proficient) {
		case ProficiencyLevel.Proficient:
			modifier += character.proficiencyBonus;
			break;
		case ProficiencyLevel.Expertise:
			modifier += 2 * character.proficiencyBonus;
			break;
		default:
			if (character.jackOfAllTrades) {
				modifier += Math.floor(character.proficiencyBonus / 2);
			}
			break;
	}

	return modifier;
}

export function calculateSavingThrowModifier(character: DnDCharacter, stat: keyof Stats): number {
	let modifier = getStatModifier(character.stats[ stat ]);


	switch (character.savingThrowProficiencies[ stat ]) {
		case SavingThrowProficiencyLevel.Proficient:
			modifier += character.proficiencyBonus;
			break;
	}

	return modifier;
}

//helper function

export function getStatModifierForSkill(character: DnDCharacter, skill: keyof skills): number {
	const statMapping: { [ key in keyof skills ]: keyof Stats } = {
		acrobatics: "dex",
		animalHandling: "wis",
		arcana: "int",
		athletics: "str",
		deception: "cha",
		history: "int",
		insight: "wis",
		intimidation: "cha",
		investigation: "int",
		medicine: "wis",
		nature: "int",
		perception: "wis",
		performance: "cha",
		persuasion: "cha",
		religion: "int",
		sleightOfHand: "dex",
		stealth: "dex",
		survival: "wis",
	};


	const stat = statMapping[ skill ];
	return getStatModifier(character.stats[ stat ]);
}

function getStatModifier(stat: number) {
	return Math.floor((stat - 10) / 2);
}

export function calculateSneakAttackDice(rougeLevel: number) {
	return Math.ceil(rougeLevel / 2);
}

export function copyCharacter(character: DnDCharacter): DnDCharacter {
	return Object.assign(new DnDCharacter(), character);
}

export function convertItemToArmor(item: Item): Armor | null {
	if (!item.properties || item.type !== 'Armor') {
		console.error("Item is not an armor or doesn't have properties.");
		return null; // Only process items of type "Armor"
	}

	const armorTypeMap: { [ key: string ]: "Light" | "Medium" | "Heavy" } = {
		"Light Armor": "Light",
		"Medium Armor": "Medium",
		"Heavy Armor": "Heavy"
	};

	// Extract armor type from item properties, or return null if it's invalid
	const armorType = armorTypeMap[ item.properties.armorType ];
	if (!armorType) {
		console.error(`Unknown armor type for item: ${item.name}`);
		return null;
	}

	// Create the armor object from the item
	const armor: Armor = {
		name: item.name,
		type: armorType,
		ac: item.properties.ac, // Base AC from item properties
		weight: item.weight ?? 0, // Weight, or default to 0
		maxDex: item.properties.maxDex, // Optional, depends on armor type
		strReq: item.properties.strength, // Optional, for heavy armors
		disadvantage: item.properties.stealth || false, // Optional
	};

	return armor;
}

export function convertItemToWeapon(item: Item) {
	if (!item.properties || item.type !== 'Weapon') {
		console.error("Item is not a weapon or doesn't have properties.");
		return null; // Only process items of type "Weapon"
	}

	// Create the weapon object from the item
	const weapon: { [ key: string ]: any } = {
		name: item.name,
		weight: item.weight ?? 0, // Weight, or default to 0
		properties: item.properties,
	};

	return weapon;
}
