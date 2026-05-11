import { DamageType } from "@/types/damage";
import {classes} from "@/constants/character";
import { Character } from "./character";
import { ModifierSpec } from "./modifiers";

export interface Feature {
	name: string; //This will be in a map where key is name and value is feature
	type: featureType;
	description: string;
	/** Rulebook or sheet origin: class, race, feat, background, item name, etc. */
	source: classes | "Feat" | "Race" | "Background" | string;
	/**
	 * Minimum character level required before this feature becomes available.
	 * Example: Aasimar's Radiant Soul uses 3.
	 */
	unlocksAtLevel?: number;
	recharge?: rechargeType;

	damage?: {
		diceCount: number;
		diceValue: number;
		type?: DamageType;
	};

	range?: string; // e.g., "30 ft", "Self", "Touch"

	charges?: number; // Number of uses per long rest, if applicable
	chargesFrom?: keyof Character; // The character property to get the charges from such as proficiencyBonus

	chargesUsed?: number;

	modifiers?: ModifierSpec[];

	selection?: Set<string>; // e.g., expertise at level 1: "Athletics", "Acrobatics"
	metadata?: Record<string, any>; // Additional data as needed
	entries?: Array<string | object>; // either a string or an object
}

export const featureType = {
    Passive: "Passive",
    Action: "Action",
    BonusAction: "Bonus Action",
    Reaction: "Reaction",
    Other: "Other",
} as const;

export type featureType = (typeof featureType)[keyof typeof featureType];

export const rechargeType = {
    Short: "Short",
    Long: "Long",
    Dawn: "Dawn",
    Other: "Other",
} as const;

export type rechargeType = (typeof rechargeType)[keyof typeof rechargeType];