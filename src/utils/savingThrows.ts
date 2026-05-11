import { Character } from "../types/character";
import { Stats } from "../types/stats";
import { getModifier } from "./stats";

export function calculateSavingThrow(character: Character, stat: keyof Stats): number {
	const statMod = getModifier(character.baseStats[stat]);
	const isProficient = character.savingThrows[stat] === "proficient";
	const profBonus = isProficient ? character.proficiencyBonus : 0;

	return statMod + profBonus;
}
