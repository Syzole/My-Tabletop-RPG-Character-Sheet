import { Character } from "@/types/character";
import { Skills, SkillName, skillStatMap } from "@/types/skills";

export function calculateSkillModifier(character: Character, skill: SkillName): number {
	const baseStat = skillStatMap[skill];
	const modifier = Math.floor((character.baseStats[baseStat] - 10) / 2);
	const proficiency = character.skills[skill].proficient;

	let bonus = 0;
	if (proficiency === "proficient") bonus = character.proficiencyBonus;
	else if (proficiency === "expertise") bonus = character.proficiencyBonus * 2;
	else if (proficiency === "halfProficient") bonus = Math.floor(character.proficiencyBonus / 2);

	return modifier + bonus;
}

export const camelCaseToTitleCase = (str: string): string => {
	return str
		.replace(/([a-z])([A-Z])/g, "$1 $2") // Add space before uppercase letters
		.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2") // Handle acronyms
		.replace(/([a-z])([0-9])/g, "$1 $2") // Add space before numbers
		.replace(/([0-9])([a-z])/g, "$1 $2") // Add space after numbers
		.replace(/([0-9])([A-Z])/g, "$1 $2") // Add space after numbers before uppercase letters
		.toLowerCase()
		.replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};
