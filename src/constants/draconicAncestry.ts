import type { DamageType } from "@/types/damage";

/**
 * One row of a Draconic Ancestry table: the dragon "color" the player picks
 * and the damage type it ties to (used for both Resistance and Breath Weapon).
 */
export interface DraconicAncestry {
	color: string;
	damage: DamageType;
}

/**
 * Defines a Dragonborn variant's breath weapon shape and the list of
 * ancestries the player may choose from.
 *
 * Used by `convertspecies.ts` to synthesize a `ChoiceGroup` that links the
 * resistance pick and the breath-weapon damage type so they cannot diverge.
 */
export interface DraconicAncestryKind {
	/**
	 * Species names this ancestry kind applies to. Match exactly against the
	 * keys in `data/species.ts`.
	 */
	speciesNames: string[];
	breathWeapon: {
		diceCount: number;
		diceValue: number;
		shape: "line" | "cone";
		sizeFeet: number;
	};
	ancestries: DraconicAncestry[];
}

/**
 * Sourced from Fizban's Treasury of Dragons (FTD) and 2024 PHB (XPHB).
 * Add new kinds here (e.g. PHB 2014 ten-color table, homebrew) without
 * touching the converter.
 */
export const DRACONIC_ANCESTRIES: Record<string, DraconicAncestryKind> = {
	chromatic: {
		speciesNames: ["Dragonborn (Chromatic)"],
		breathWeapon: { diceCount: 1, diceValue: 10, shape: "line", sizeFeet: 30 },
		ancestries: [
			{ color: "Black", damage: "acid" },
			{ color: "Blue", damage: "lightning" },
			{ color: "Green", damage: "poison" },
			{ color: "Red", damage: "fire" },
			{ color: "White", damage: "cold" },
		],
	},
	metallic: {
		speciesNames: ["Dragonborn (Metallic)"],
		breathWeapon: { diceCount: 1, diceValue: 10, shape: "line", sizeFeet: 30 },
		ancestries: [
			{ color: "Brass", damage: "fire" },
			{ color: "Bronze", damage: "lightning" },
			{ color: "Copper", damage: "acid" },
			{ color: "Gold", damage: "fire" },
			{ color: "Silver", damage: "cold" },
		],
	},
	gem: {
		speciesNames: ["Dragonborn (Gem)"],
		breathWeapon: { diceCount: 1, diceValue: 10, shape: "cone", sizeFeet: 15 },
		ancestries: [
			{ color: "Amethyst", damage: "force" },
			{ color: "Crystal", damage: "radiant" },
			{ color: "Emerald", damage: "psychic" },
			{ color: "Sapphire", damage: "thunder" },
			{ color: "Topaz", damage: "necrotic" },
		],
	},
};
