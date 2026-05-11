import { Character } from "@/types/character";
import { ModifierContext, ModifierSpec } from "@/types/modifiers";
import { getAllFeatures } from "@/utils/feature";
import { getUnlockedFeaturesByLevel } from "@/utils/featureUnlocks";
import { getModifier } from "@/utils/stats";

export function getModifiers(character: Character, context: ModifierContext): number | null {
	const features = getUnlockedFeaturesByLevel(getAllFeatures(character), character.level);
	
	let add = 0;
	let override: number | null = null;

	for (const feature of Object.values(features)) {
		const mods = (feature as { modifiers?: ModifierSpec[] }).modifiers;
		if (!mods) continue;

		for (const mod of mods) {
			if (mod.target !== context.type) continue;

			const condition = mod.condition;
			if (condition && !matchesCondition(condition, context)) continue;

			// Resolve the modifier value (either from valueFrom or static value)
			const modifierValue = resolveModifierValue(character, mod);
			if (modifierValue === null) continue; // Skip if value couldn't be resolved

			const mode = mod.mode ?? "add";
			if (mode === "add") {
				add += modifierValue;
				return add;
			} else if (mode === "override") {
				// choose highest override, or last one, whatever rule you like
				override = override == null ? modifierValue : Math.max(override, modifierValue);
				return override;
			}
		}
	}

	return null;
}

/**
 * Resolves the numeric value for a modifier.
 * If valueFrom is provided, resolves it dynamically from the character.
 * Otherwise, uses the static value field.
 *
 * @param character - The character object to resolve values from
 * @param mod - The modifier spec
 * @returns The resolved numeric value, or null if it couldn't be resolved
 */
function resolveModifierValue(character: Character, mod: ModifierSpec): number | null {
	// If valueFrom is specified, resolve it dynamically
	if (mod.valueFrom) {
		const rawValue = resolveValueFrom(character, mod.valueFrom);
		if (rawValue === null) return null;

		// Apply transform if specified
		if (mod.valueTransform === "modifier") {
			return getModifier(rawValue);
		}
		// valueTransform === "raw" or undefined
		return rawValue;
	}

	// Fall back to static value
	if (mod.value !== undefined) {
		return mod.value;
	}

	// No value specified
	return null;
}

/**
 * Resolves a dot-notation path from the character object.
 * Examples:
 * - "baseStats.con" -> character.baseStats.con
 * - "hitPoints.max" -> character.hitPoints.max
 * - "proficiencyBonus" -> character.proficiencyBonus
 *
 * @param character - The character object to resolve from
 * @param path - Dot-notation path (e.g., "baseStats.con")
 * @returns The resolved value, or null if the path doesn't exist or isn't a number
 */
export function resolveValueFrom(character: Character, path: string): number | null {
	const parts = path.split(".");
	let value: any = character;

	for (const part of parts) {
		if (value == null || typeof value !== "object") {
			return null;
		}
		value = value[part];
	}

	// Ensure we got a number
	if (typeof value !== "number") {
		return null;
	}

	return value;
}

// generic "does every field in condition match context?" helper
export function matchesCondition(condition: Partial<ModifierContext>, context: ModifierContext): boolean {
	for (const [key, value] of Object.entries(condition)) {
		// @ts-expect-error index access
		if (context[key] !== value) return false;
	}
	return true;
}