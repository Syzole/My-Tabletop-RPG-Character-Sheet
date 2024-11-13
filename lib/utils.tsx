// utils.ts

import DnDCharacter from "./DnDCharacter";

import { Armor, Item, ProficiencyLevel, SavingThrowProficiencyLevel, skills, Stats, Weapon } from "./types";

import { martialMelee, martialRanged, simpleMelee, simpleRanged, simpleWeapons, martialWeapons } from "./definitions";

function getProficientWeapons(character: DnDCharacter) {
	const allWeapons = simpleMelee.concat(simpleRanged, martialMelee, martialRanged);

	// Create a set of proficient weapons
	const proficientWeapons = new Set(character.proficiencies.weapons);

	// Create an array to hold proficient weapons
	const weapons = [];

	// Check for proficiency in individual weapons
	allWeapons.forEach((weapon) => {
		if (proficientWeapons.has(weapon)) {
			weapons.push(weapon);
		}
	});

	// Check for proficiency in weapon categories
	if (proficientWeapons.has("Simple weapons")) {
		weapons.push(...simpleWeapons); // Add all simple weapons
	}
	if (proficientWeapons.has("Martial weapons")) {
		weapons.push(...martialWeapons); // Add all martial weapons
	}

	return weapons;
}


export function calculateAttackBonus(character: DnDCharacter, weapon: Weapon) {
	const weaponType = weapon.properties.weaponType;

	const proficientWeapons = getProficientWeapons(character);
	const isProficient = proficientWeapons.includes(weaponType);

	let modifier = 0;

	// console.log("weapon", weaponType, isProficient, weapon);

	switch (weapon.rangeType) {
		case "Melee":
			modifier = calculateMeleeAttackBonus(character, isProficient, weapon);
			break;
		case "Ranged":
			modifier = calculateRangedAttackBonus(character, isProficient, weapon);
			break;
	}

	return modifier;
}

function calculateMeleeAttackBonus(character: DnDCharacter, isProficient: boolean, weapon: Weapon) {
	let modifier = getStatModifier(character.stats.str);

	if (weapon.properties.property?.includes("Finesse")) {
		const dexModifier = getStatModifier(character.stats.dex);
		const strModifier = getStatModifier(character.stats.str);

		modifier = Math.max(dexModifier, strModifier);
	}

	if (isProficient) {
		modifier += character.proficiencyBonus;
	}

	return modifier;
}

function calculateRangedAttackBonus(character: DnDCharacter, isProficient: boolean, weapon: Weapon) {
	let modifier = getStatModifier(character.stats.dex);

	if (isProficient) {
		modifier += character.proficiencyBonus;
	}

	return modifier;
}

export function calculateDamageBonus(character: DnDCharacter, weapon: Weapon) {
	const weaponType = weapon.properties.weaponType;

	const proficientWeapons = getProficientWeapons(character);
	const isProficient = proficientWeapons.includes(weaponType);

	let modifier = 0;

	switch (weapon.rangeType) {
		case "Melee":
			modifier = calculateMeleeDamageBonus(character, isProficient, weapon);
			break;
		case "Ranged":
			modifier = calculateRangedDamageBonus(character, isProficient, weapon);
			break;
	}

	return modifier;
}

function calculateMeleeDamageBonus(character: DnDCharacter, isProficient: boolean, weapon: Weapon) {
	let modifier = getStatModifier(character.stats.str);

	if (weapon.properties.property?.includes("Finesse")) {
		const dexModifier = getStatModifier(character.stats.dex);
		const strModifier = getStatModifier(character.stats.str);

		modifier = Math.max(dexModifier, strModifier);
	}

	if (isProficient) {
		modifier += character.proficiencyBonus;
	}

	return modifier;
}

function calculateRangedDamageBonus(character: DnDCharacter, isProficient: boolean, weapon: Weapon) {
	let modifier = getStatModifier(character.stats.dex);

	if (isProficient) {
		modifier += character.proficiencyBonus;
	}

	return modifier;
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

export function convertItemToWeapon(item: Item): Weapon {
	if (!item.properties || item.type !== 'Weapon') {
		console.error("Item is not a weapon or doesn't have properties.");
		throw new Error("Item is not a weapon or doesn't have properties.");
	}
	const propertiesCopy = { ...item.properties };

	const weapon: Weapon = {
		name: item.name,
		rangeType: propertiesCopy.rangeType ?? "Melee", // Set default rangeType to "Melee" if not provided
		damage: propertiesCopy.dmg1 ?? "0", // Provide a default value for damage if missing
		damageType: propertiesCopy.dmgType ?? "Bludgeoning", // Provide a default value for damageType if missing
		properties: propertiesCopy, // Keep the remaining properties for the weapon
	};

	// Remove the properties that have already been used
	delete propertiesCopy.rangeType; // Remove rangeType
	delete propertiesCopy.dmg1;      // Remove dmg1
	delete propertiesCopy.dmgType;    // Remove dmgType

	// Update the properties to only include unused properties
	weapon.properties = propertiesCopy;

	return weapon;
}


export const TestParagraphs = () => {
	const paragraphs = []; // Initialize an array to hold paragraph elements

	// Use a loop to fill the array with <p> elements
	for (let i = 0; i < 500; i++) {
		paragraphs.push(<p key={ i }>Test { i + 1 }</p>);
	}

	return (
		<div>
			{ paragraphs } {/* Render the array of <p> elements */ }
		</div>
	);
};