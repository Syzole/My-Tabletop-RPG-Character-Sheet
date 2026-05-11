/**
 * Feature upgrade relationships.
 *
 * Each entry maps a *stronger* feature to the list of *weaker* features it
 * supersedes. When a character ends up with both (e.g. parent Elf grants
 * "Darkvision" and Drow subspecies grants "Superior Darkvision"), the
 * weaker ones are dropped during merging.
 *
 * Goals:
 *   - Single source of truth: no `if (feature === "Darkvision") ...`
 *     scattered across `mergeSubspecies`, `applyPatch`, future
 *     `applySpecies`, etc.
 *   - Author once, applies everywhere a character's effective feature set
 *     is computed.
 *
 * Conventions:
 *   - Keys and values use the canonical feature name as it appears in the
 *     `Feature.name` field.
 *   - Add new entries when introducing class/race features that supersede
 *     earlier ones (e.g. "Improved Pact Weapon" -> ["Pact Weapon"]).
 *   - The relationship is *one-way*: stronger entries here will not be
 *     deleted because a weaker variant exists.
 * 
 *  This can also be used for class features that supersede earlier ones.
 */
export const FEATURE_UPGRADES: Record<string, readonly string[]> = {
	"Superior Darkvision": ["Darkvision"],
	"Devil's Sight": ["Darkvision"],
};
