import { Feature } from "./feature";
import { SkillName } from "./skills";

// Different kinds of things that can be modified
export type AttackRollContext = {
	type: "attackRoll";
	attackType: "melee" | "ranged";
};

export type SavingThrowContext = {
	type: "savingThrow";
	ability: "str" | "dex" | "con" | "int" | "wis" | "cha";
};

export type SkillCheckContext = {
	type: "skillCheck";
	skill: SkillName;
};

export type StatContext = {
	type: "stat";
	stat: "str" | "dex" | "con" | "int" | "wis" | "cha";
};

export type ACContext = {
	type: "ac";
	isWearingArmor?: boolean; // true if wearing armor, false if not
};

export type proficiencyBonusContext = {
	type: "proficiencyBonus";
};

// Union of all modifier contexts
export type ModifierContext = AttackRollContext | SavingThrowContext | SkillCheckContext | StatContext | ACContext;

// Generic modifier spec that can target any context type
export interface ModifierSpec<T extends ModifierContext["type"] = ModifierContext["type"]> {
	target: T;
	/**
	 * How the modifier applies:
	 * - "add": add value to the existing total
	 * - "override": replace the base value entirely (caller decides how to combine)
	 */
	mode?: "add" | "override";
	/**
	 * Static numeric value. Used if valueFrom is not provided.
	 * If both value and valueFrom are provided, valueFrom takes precedence.
	 */
	value?: number;
	/**
	 * Dynamic value path using dot notation to reference character properties.
	 * Examples:
	 * - "baseStats.con" for Constitution stat
	 * - "baseStats.dex" for Dexterity stat
	 * - "hitPoints.max" for maximum hit points
	 * - "proficiencyBonus" for proficiency bonus
	 * - "level" for character level
	 *
	 * The path is resolved from the character object, e.g., "baseStats.con" becomes character.baseStats.con
	 */
	valueFrom?: string;
	/**
	 * Transform to apply to the resolved value:
	 * - "modifier": converts stat values (e.g., 13) to modifiers (e.g., +1) using getModifier()
	 * - "raw": uses the value as-is
	 *
	 * Defaults to "raw" if not specified.
	 * Only applies when valueFrom is used.
	 */
	valueTransform?: "modifier" | "raw";
	/**
	 * Extra conditions that must match the context for this modifier to apply.
	 * Only the fields relevant to the target's context type will be used.
	 *
	 * Examples:
	 * - { attackType: "melee" } for attack rolls
	 * - { ability: "dex" } for dex saving throws
	 * - { skill: "Stealth" } for stealth checks
	 * - { stat: "dex" } for dexterity stat
	 * - { hasArmor: false } for AC when not wearing armor
	 */
	condition?: Partial<Extract<ModifierContext, { type: T }>>;
}
