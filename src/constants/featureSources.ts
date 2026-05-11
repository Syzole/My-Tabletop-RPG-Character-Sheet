import type { Character } from "@/types/character";
import type { Feature } from "@/types/feature";
import { CLASS_FEATURE_MAP, SUBCLASS_FEATURE_MAP } from "@/data/classes";
import { getUnlockedFeaturesByLevel } from "@/utils/featureUnlocks";

type Collector = (character: Character) => Record<string, Feature> | undefined;

/**
 * Single source of truth: merge order is this array’s order; each entry’s `name`
 * is the display key (later layers win on feature name collision).
 */
export const FEATURE_SOURCE_DEFINITIONS = [
	{ name: "Race", collect: (c: Character) => c.race.features },
	{
		name: "Class",
		collect: (c: Character) => {
			const catalog = CLASS_FEATURE_MAP[c.class];
			if (!catalog) return undefined;
			return getUnlockedFeaturesByLevel(catalog, c.level);
		},
	},
	{
		name: "Subclass",
		collect: (c: Character) => {
			const sub = c.subclass?.trim();
			if (!sub) return undefined;
			const byClass = SUBCLASS_FEATURE_MAP[c.class];
			const catalog = byClass?.[sub];
			if (!catalog) return undefined;
			return getUnlockedFeaturesByLevel(catalog, c.level);
		},
	},
	{ name: "Background", collect: (_c: Character) => undefined },
	{ name: "Items", collect: (_c: Character) => undefined },
	{ name: "Feats", collect: (_c: Character) => undefined },
	{ name: "Character sheet", collect: (c: Character) => c.features },
] as const satisfies ReadonlyArray<{
	readonly name: string;
	readonly collect: Collector;
}>;

export type FeatureSourceName = (typeof FEATURE_SOURCE_DEFINITIONS)[number]["name"];

/** Same order as {@link FEATURE_SOURCE_DEFINITIONS} — derived, do not edit manually. */
export const FEATURE_SOURCE_ORDER: readonly FeatureSourceName[] =
	FEATURE_SOURCE_DEFINITIONS.map((d) => d.name);

/**
 * Merges feature maps from all sources in {@link FEATURE_SOURCE_DEFINITIONS}.
 * Does not apply FEATURE_UPGRADES deduplication — use `getAllFeatures` for that.
 */
export function mergeFeaturesFromAllSources(character: Character): Record<string, Feature> {
	const merged: Record<string, Feature> = {};
	for (const { collect } of FEATURE_SOURCE_DEFINITIONS) {
		const layer = collect(character);
		if (!layer) continue;
		for (const [featureName, feature] of Object.entries(layer)) {
			merged[featureName] = feature;
		}
	}
	return merged;
}
