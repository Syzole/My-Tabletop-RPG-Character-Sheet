import { Stats } from "@/types/stats";

export function getModifier(score: number): number {
	return Math.floor((score - 10) / 2);
}

export function getEffectiveStats(base: Stats, mods: Stats): Stats {
	return {
		strength: base.strength + mods.strength,
		dexterity: base.dexterity + mods.dexterity,
		constitution: base.constitution + mods.constitution,
		intelligence: base.intelligence + mods.intelligence,
		wisdom: base.wisdom + mods.wisdom,
		charisma: base.charisma + mods.charisma,
	};
}
