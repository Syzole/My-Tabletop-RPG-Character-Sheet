// utils.ts

import DnDCharacter from "./DnDCharacter";

import { Stats, SavingThrowProficiencyLevel, ProficiencyLevel, skills } from "./types";

import { simpleMelee, simpleRanged, martialMelee, martialRanged } from "./definitions";

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

