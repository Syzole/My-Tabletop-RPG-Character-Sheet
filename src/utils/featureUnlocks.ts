import type { Feature } from "@/types/feature";

export function isFeatureUnlockedAtLevel(feature: Feature, level: number): boolean {
	if (feature.unlocksAtLevel == null) return true;
	return level >= feature.unlocksAtLevel;
}

export function getUnlockedFeaturesByLevel(
	features: Record<string, Feature> | undefined,
	level: number,
): Record<string, Feature> {
	if (!features) return {};
	const out: Record<string, Feature> = {};
	for (const [name, feature] of Object.entries(features)) {
		if (isFeatureUnlockedAtLevel(feature, level)) out[name] = feature;
	}
	return out;
}

/**
 * Merges every feature from `available` that is unlocked at `level` into `current`.
 * Names not present in `current` before the merge are listed in `newlyUnlocked`.
 */
export function grantUnlockedFeatures(
	current: Record<string, Feature>,
	available: Record<string, Feature>,
	level: number,
): { features: Record<string, Feature>; newlyUnlocked: string[] } {
	const features: Record<string, Feature> = { ...current };
	const newlyUnlocked: string[] = [];
	for (const [name, feat] of Object.entries(available)) {
		if (!isFeatureUnlockedAtLevel(feat, level)) continue;
		if (features[name] === undefined) newlyUnlocked.push(name);
		features[name] = feat;
	}
	return { features, newlyUnlocked };
}