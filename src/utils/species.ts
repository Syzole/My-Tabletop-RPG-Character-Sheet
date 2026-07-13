import type { Feature } from "@/types/feature";
import type { Species, SpeciesPatch, Subspecies } from "@/types/species";
import type { Stats } from "@/types/stats";
import { species as SPECIES_DATA } from "@/private-assets/data/species";
import { dedupeFeatureUpgrades } from "@/utils/featureUpgrades";
import { ChoiceGroup } from "@/types/choices";
/**
 * A player's choices for a species at character creation. The shape is
 * `{ [choiceGroupId]: optionId | optionId[] }`. Single-pick groups use a
 * string; multi-pick groups (count > 1) use an array.
 */
export type SpeciesPicks = Record<string, string | string[]>;

/**
 * Apply a SpeciesPatch onto a Species, returning a new Species. Pure; does
 * not mutate inputs.
 *
 * Merge rules (mirrors the doc on SpeciesPatch):
 *   - resistances: appended, de-duped
 *   - languages:   appended, de-duped
 *   - speed:       per-key shallow merge (patch wins)
 *   - abilityScoreIncreases: per-stat addition
 *   - features:    shallow merge by feature name (patch keys overwrite)
 */
export function applyPatch(species: Species, patch: SpeciesPatch): Species {
  // Deep clone up front so callers can keep using their original species
  // reference. Patches are typically authored as plain object literals in
  // the data file, so we don't worry about cloning *them*.
  const out: Species = structuredClone(species);

  if (patch.resistances?.length) {
    // Set-based union de-dupes if the same damage type already exists
    // (e.g. parent grants fire, an option also grants fire).
    const merged = new Set([...(out.resistances ?? []), ...patch.resistances]);
    out.resistances = [...merged];
  }

  if (patch.languages?.length) {
    // `out.languages` is a Set; spreading union-merges naturally.
    out.languages = new Set([...out.languages, ...patch.languages]);
  }

  if (patch.speed) {
    // Per-key shallow merge: a patch like { fly: 60 } leaves walk/swim
    // alone. To zero a speed type, the patch must explicitly set it to 0.
    out.speed = { ...out.speed, ...patch.speed };
  }

  if (patch.abilityScoreIncreases) {
    // IMPORTANT: ability bumps ADD, they don't overwrite. Half-Elf's +2 cha
    // plus a chosen +1 cha ChoiceOption must produce +3, not +1.
    const acc: Partial<Stats> = { ...out.abilityScoreIncreases };
    for (const [key, delta] of Object.entries(patch.abilityScoreIncreases)) {
      if (typeof delta !== "number") continue;
      const k = key as keyof Stats;
      acc[k] = (acc[k] ?? 0) + delta;
    }
    out.abilityScoreIncreases = acc;
  }

  if (patch.features) {
    for (const [name, partial] of Object.entries(patch.features)) {
      const existing: Feature | undefined = out.features[name];
      if (existing) {
        // Shallow merge: a patch with `damage: { ... }` overwrites the
        // whole damage object, but leaves description/source/etc. alone.
        // This is the mechanism that turns a generic "Breath Weapon"
        // into "Breath Weapon (lightning)" when an ancestry is picked.
        out.features[name] = { ...existing, ...partial } as Feature;
      } else if (
        partial.name &&
        partial.type &&
        partial.description &&
        partial.source
      ) {
        // Allow patches to introduce a brand-new feature, but only if
        // all required fields are present. Partial features that would
        // be runtime-broken are silently ignored — better than a half-
        // constructed feature blowing up the character sheet.
        out.features[name] = partial as Feature;
      }
    }
    // Run upgrade dedup once after all feature overlays. Doing it here
    // (instead of inside the loop) means a single pass and avoids order-
    // dependent bugs if multiple patches touch overlapping features.
    out.features = dedupeFeatureUpgrades(out.features);
  }

  return out;
}

/**
 * Merge a parent Species with one of its Subspecies (selected by name) into
 * a single resolved Species. The subspecies adds/overrides the parent's
 * fields; the resolved species still carries its `choices` so the caller can
 * walk them and apply picks via `applySpeciesPicks`.
 */
export function mergeSubspecies(parent: Species, sub: Subspecies): Species {
  const out: Species = structuredClone(parent);

  // Speed: per-key overwrite. A subspecies like Aquatic Half-Elf can add
  // `swim: 30` without disturbing the parent's walk speed.
  if (sub.speed) out.speed = { ...out.speed, ...sub.speed };

  // Ability bumps from the subspecies REPLACE per-key (e.g. Drow's `cha: 1`
  // is independent of the parent Elf's stats). If you want subspecies bumps
  // to stack with parent bumps, switch this to the additive logic from
  // applyPatch — but D&D rules generally treat subrace bumps as additive
  // only because the parent and subrace target different abilities.
  if (sub.abilityScoreIncreases) {
    out.abilityScoreIncreases = {
      ...out.abilityScoreIncreases,
      ...sub.abilityScoreIncreases,
    };
  }

  if (sub.features) {
    // Merge then dedup. The dedup step is what removes parent Elf's
    // vanilla Darkvision when Drow brings in Superior Darkvision —
    // driven by FEATURE_UPGRADES, not by hardcoded names here.
    out.features = dedupeFeatureUpgrades({ ...out.features, ...sub.features });
  }

  // Set-union: parent's Common+Elvish stays; subspecies extras add on.
  if (sub.languages)
    out.languages = new Set([...out.languages, ...sub.languages]);

  if (sub.resistances?.length) {
    const merged = new Set([...(out.resistances ?? []), ...sub.resistances]);
    out.resistances = [...merged];
  }

  // Choice groups stack: a subspecies can add its own picks on top of the
  // parent's. Keep both arrays so the creator UI prompts for everything.
  if (sub.choices?.length)
    out.choices = [...(out.choices ?? []), ...sub.choices];

  // Re-label the merged result so downstream code shows e.g. "Drow Elf"
  // rather than "Elf". Using `${sub.name} ${parent.name}` is a deliberate
  // English convention; flip if you'd prefer "Elf (Drow)" later.
  out.name = `${sub.name} ${parent.name}`.trim();
  out.source = sub.source;

  // The merged species *is* the chosen subspecies — keeping the others
  // available would be misleading and waste serialization space.
  delete out.subspecies;
  return out;
}

/** Apply each pick from a `SpeciesPicks` map to the species via `applyPatch`. */
export function applySpeciesPicks(
  species: Species,
  picks: SpeciesPicks,
): Species {
  // Fast-path: nothing to resolve.
  if (!species.choices?.length) return species;

  // `out` is reassigned on every applyPatch — this is intentional.
  // applyPatch returns a NEW species. If we wrote `applyPatch(out, ...)`
  // without the assignment, only the last pick's effects would survive.
  let out = species;
  for (const group of species.choices) {
    const pick = picks[group.id];
    if (!pick) continue; // Player hasn't decided yet — leave group pending.

    // Normalize string-or-array. A multi-pick group (count: 2) like
    // Half-Elf's ability bump arrives as ["str","dex"]; a single-pick
    // group like Draconic Ancestry arrives as just "Blue".
    const ids = Array.isArray(pick) ? pick : [pick];
    for (const id of ids) {
      const opt = group.options.find((o) => o.id === id);
      // Silently ignore unknown ids — they may come from saved data
      // that referenced an option since removed by a regenerate.
      if (!opt) continue;
      out = applyPatch(out, opt.apply);
    }
  }

  // Prune resolved groups so the creator UI sees only what's still pending.
  // Once `choices` is empty we delete it entirely; it's an optional field
  // and keeping it as `[]` would be misleading "still has choices?" data.
  const remaining = out.choices?.filter((g) => !isResolved(g, picks));
  if (remaining && remaining.length > 0) out.choices = remaining;
  else delete out.choices;
  return out;
}

/**
 * Has the player made enough picks for this group? Multi-pick groups need
 * `count` distinct picks; default count is 1.
 *
 * Uses `>= expected` (not strict equality) so that extra picks coming in
 * from corrupted save state still count as resolved — better than leaving
 * a group eternally pending in the UI.
 */
function isResolved(group: ChoiceGroup, picks: SpeciesPicks): boolean {
  const expected = group.count ?? 1;
  const pick = picks[group.id];
  if (!pick) return false;
  const count = Array.isArray(pick) ? pick.length : 1;
  return count >= expected;
}

/**
 * Top-level helper: look up a species by name, optionally merge in a
 * subspecies, then apply the player's choice picks. The result has all
 * resolved fields ready to merge into a Character (forthcoming `applySpecies`).
 */
export function resolveSpecies(
  name: string,
  options: { subspecies?: string; picks?: SpeciesPicks } = {},
): Species | undefined {
  const base = SPECIES_DATA[name];
  // Returning undefined (rather than throwing) lets callers display "unknown
  // species" in the UI without having to wrap every call in try/catch.
  if (!base) return undefined;

  // Clone before any mutation. The data file is shared module state — if
  // we mutated it, every subsequent call would see the corrupted version.
  let resolved: Species = structuredClone(base);

  // Pipeline order matters: subspecies first, picks second.
  // A subspecies may add new ChoiceGroups (e.g. Aasimar revelation) that
  // the picks step then resolves. Reversing the order would cause those
  // added groups to be ignored.
  if (options.subspecies && resolved.subspecies?.[options.subspecies]) {
    resolved = mergeSubspecies(
      resolved,
      resolved.subspecies[options.subspecies],
    );
  }
  if (options.picks) {
    resolved = applySpeciesPicks(resolved, options.picks);
  }
  return resolved;
}
