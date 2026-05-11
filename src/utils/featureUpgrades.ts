import type { Feature } from "@/types/feature";
import { FEATURE_UPGRADES } from "@/constants/featureUpgrades";

/**
 * Returns a copy of `features` with weaker variants removed when a stronger
 * counterpart is present, per the FEATURE_UPGRADES table.
 *
 * Pure: never mutates the input.
 *
 * Use anywhere a character's effective feature set is computed:
 *   - mergeSubspecies (parent + subspecies overlap)
 *   - applyPatch (a chosen option introduces a stronger feature)
 *   - future applySpecies / applyClass / applyFeat
 */
export function dedupeFeatureUpgrades(
	features: Record<string, Feature>,
): Record<string, Feature> {
	// Shallow copy is fine: we only delete keys, never mutate values.
	const out = { ...features };
	// O(table_size × max_weakers_per_row). Both are tiny — fine to call on
	// every merge without worrying about perf.
	for (const [stronger, weakerList] of Object.entries(FEATURE_UPGRADES)) {
		// Skip rows whose stronger feature isn't on this character; the rule
		// only fires when the stronger version is actually present.
		if (!out[stronger]) continue;
		for (const weaker of weakerList) {
			if (out[weaker]) delete out[weaker];
		}
	}
	return out;
}

/**
 * Returns true if `name` is already covered in `features` — either present
 * directly, or because a feature that supersedes it (per FEATURE_UPGRADES)
 * is present.
 *
 * Used by the converter to decide whether to synthesize a default feature
 * (e.g. don't synthesize "Darkvision" when the species already has
 * "Superior Darkvision").
 */
export function isFeatureCovered(
	name: string,
	features: Record<string, Feature>,
): boolean {
	// Direct hit — the feature is literally there.
	if (features[name]) return true;
	// Otherwise, scan the table to see if a stronger version is present.
	// This is the same shape as dedupeFeatureUpgrades but inverted: instead
	// of "stronger -> drop weakers", we ask "is anything that supersedes
	// `name` already in this character's feature set?".
	for (const [stronger, weakerList] of Object.entries(FEATURE_UPGRADES)) {
		if (features[stronger] && weakerList.includes(name)) return true;
	}
	return false;
}
