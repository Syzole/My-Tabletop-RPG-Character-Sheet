import type { Character } from "@/types/character";
import type { Feature } from "@/types/feature";
import type { Item } from "@/types/item";
import {
  CLASS_FEATURE_MAP,
  SUBCLASS_FEATURE_MAP,
} from "@/private-assets/data/classes";
import {
  grantUnlockedFeatures,
  isFeatureUnlockedAtLevel,
} from "@/utils/featureUnlocks";

type Collector = (character: Character) => Record<string, Feature> | undefined;
/** Writes a feature back into a character-owned source. Returns null if not owned here. */
type Updater = (character: Character, feature: Feature) => Character | null;

/**
 * Static class + subclass catalogs for this character (not filtered by level).
 * Used when copying features onto the character at create / level-up.
 */
export function getCatalogFeaturesForCharacter(
  character: Pick<Character, "class" | "subclass">,
): Record<string, Feature> {
  const out: Record<string, Feature> = {};
  const classCatalog = CLASS_FEATURE_MAP[character.class];
  if (classCatalog) {
    for (const [name, feature] of Object.entries(classCatalog)) {
      out[name] = feature;
    }
  }
  const sub = character.subclass?.trim();
  if (sub) {
    const subclassCatalog = SUBCLASS_FEATURE_MAP[character.class]?.[sub];
    if (subclassCatalog) {
      for (const [name, feature] of Object.entries(subclassCatalog)) {
        out[name] = feature;
      }
    }
  }
  return out;
}

/**
 * Clones unlocked class/subclass catalog features into an owned map.
 * Existing owned entries are preserved (charges, selections, etc.).
 */
export function copyUnlockedClassFeatures(
  character: Pick<Character, "class" | "subclass" | "level">,
  current: Record<string, Feature> = {},
): { features: Record<string, Feature>; newlyUnlocked: string[] } {
  return grantUnlockedFeatures(
    current,
    getCatalogFeaturesForCharacter(character),
    character.level,
  );
}

/** Race features that become available when going from `fromLevel` → `toLevel`. */
export function newlyUnlockedRaceFeatures(
  character: Pick<Character, "race">,
  fromLevel: number,
  toLevel: number,
): string[] {
  const names: string[] = [];
  for (const [name, feature] of Object.entries(character.race.features ?? {})) {
    if (
      !isFeatureUnlockedAtLevel(feature, fromLevel) &&
      isFeatureUnlockedAtLevel(feature, toLevel)
    ) {
      names.push(name);
    }
  }
  return names;
}

function itemCurrentlyGrants(item: Item): boolean {
  if (item.requiresAttunement) return !!item.isAttuned;
  if (item.canEquip || item.equipped !== undefined) return !!item.equipped;
  return true;
}

function collectItemGrantedFeatures(
  character: Character,
): Record<string, Feature> {
  const out: Record<string, Feature> = {};
  const absorb = (item: Item | undefined) => {
    if (!item?.grantsFeatures || !itemCurrentlyGrants(item)) return;
    for (const [name, feature] of Object.entries(item.grantsFeatures)) {
      out[name] = feature;
    }
  };
  for (const item of Object.values(character.equipment ?? {})) {
    absorb(item);
  }
  absorb(character.armor);
  return out;
}

function updateItemGrantedFeature(
  character: Character,
  feature: Feature,
): Character | null {
  for (const [key, item] of Object.entries(character.equipment ?? {})) {
    if (!item.grantsFeatures?.[feature.name]) continue;
    return {
      ...character,
      equipment: {
        ...character.equipment,
        [key]: {
          ...item,
          grantsFeatures: {
            ...item.grantsFeatures,
            [feature.name]: feature,
          },
        },
      },
    };
  }
  if (character.armor?.grantsFeatures?.[feature.name]) {
    return {
      ...character,
      armor: {
        ...character.armor,
        grantsFeatures: {
          ...character.armor.grantsFeatures,
          [feature.name]: feature,
        },
      },
    };
  }
  return null;
}

/**
 * Single source of truth: merge order is this array’s order; each entry’s `name`
 * is the display key (later layers win on feature name collision).
 *
 * Sticky sources (Race / Class / Background / Feats) own copies on the character.
 * Items are derived from equipped/attuned gear — not copied into a bag.
 */
export const FEATURE_SOURCE_DEFINITIONS = [
  {
    name: "Race",
    collect: (c: Character) => c.race.features,
    update: (c: Character, feature: Feature): Character | null => {
      if (!c.race.features?.[feature.name]) return null;
      return {
        ...c,
        race: {
          ...c.race,
          features: { ...c.race.features, [feature.name]: feature },
        },
      };
    },
  },
  {
    name: "Class",
    /** Owned class + subclass feature instances (cloned from catalogs). */
    collect: (c: Character) => c.features,
    update: (c: Character, feature: Feature): Character | null => {
      if (!c.features?.[feature.name]) return null;
      return {
        ...c,
        features: { ...c.features, [feature.name]: feature },
      };
    },
  },
  {
    name: "Background",
    collect: (c: Character) => c.backgroundFeatures,
    update: (c: Character, feature: Feature): Character | null => {
      if (!c.backgroundFeatures?.[feature.name]) return null;
      return {
        ...c,
        backgroundFeatures: {
          ...c.backgroundFeatures,
          [feature.name]: feature,
        },
      };
    },
  },
  {
    name: "Items",
    collect: collectItemGrantedFeatures,
    update: updateItemGrantedFeature,
  },
  {
    name: "Feats",
    collect: (c: Character) => c.feats,
    update: (c: Character, feature: Feature): Character | null => {
      if (!c.feats?.[feature.name]) return null;
      return {
        ...c,
        feats: { ...c.feats, [feature.name]: feature },
      };
    },
  },
] as const satisfies ReadonlyArray<{
  readonly name: string;
  readonly collect: Collector;
  readonly update: Updater;
}>;

export type FeatureSourceName =
  (typeof FEATURE_SOURCE_DEFINITIONS)[number]["name"];

/** Same order as {@link FEATURE_SOURCE_DEFINITIONS} — derived, do not edit manually. */
export const FEATURE_SOURCE_ORDER: readonly FeatureSourceName[] =
  FEATURE_SOURCE_DEFINITIONS.map((d) => d.name);

/**
 * Merges feature maps from all sources in {@link FEATURE_SOURCE_DEFINITIONS}.
 * Does not apply FEATURE_UPGRADES deduplication — use `getAllFeatures` for that.
 */
export function mergeFeaturesFromAllSources(
  character: Character,
): Record<string, Feature> {
  const merged: Record<string, Feature> = {};
  for (const { collect } of FEATURE_SOURCE_DEFINITIONS) {
    const layer = collect(character);
    if (!layer) continue;
    for (const [featureName, feature] of Object.entries(layer)) {
      merged[featureName] = feature as Feature;
    }
  }
  return merged;
}

/**
 * Writes a mutated feature back into the owning source (last merge winner first).
 */
export function updateFeatureInSources(
  character: Character,
  feature: Feature,
): Character {
  for (let i = FEATURE_SOURCE_DEFINITIONS.length - 1; i >= 0; i--) {
    const updated = FEATURE_SOURCE_DEFINITIONS[i].update(character, feature);
    if (updated) return updated;
  }
  // Fallback: treat as owned class/homebrew feature.
  return {
    ...character,
    features: { ...(character.features ?? {}), [feature.name]: feature },
  };
}
