import { proficiencyBonus } from "@/constants/character";
import {
  CUSTOM_BACKGROUND_KEY,
  getBackgroundLabel,
  getBackgroundStartingEquipment,
  type BackgroundSelectionKey,
} from "@/constants/backgrounds";
import { CLASS_STARTING_INFO } from "@/private-assets/data/classStartingInfo";
import { species as SPECIES_DATA } from "@/private-assets/data/species";
import type { ChoiceItem, ChoiceOption } from "@/types/class";
import type { Character } from "@/types/character";
import type { Item } from "@/types/item";
import type { Proficiencies } from "@/types/proficiencies";
import { defaultSavingThrows } from "@/types/savingThrows";
import { defaultSkills, type SkillName } from "@/types/skills";
import { defaultStats, type Stats } from "@/types/stats";
import { resolveSpecies } from "@/utils/species";
import { getModifier } from "@/utils/stats";

/** Minimal hit-die labels by class display name — extend when you add classes. */
const DEFAULT_HIT_DIE: Partial<Record<string, string>> = {
  Rogue: "d8",
  Sorcerer: "d6",
  Warlock: "d8",
  Fighter: "d10",
};

const DEFAULT_HIT_DIE_VALUE: Partial<Record<string, number>> = {
  Rogue: 8,
  Sorcerer: 6,
  Warlock: 8,
  Fighter: 10,
};

export type HpMode = "average" | "manual";

export type CreateCharacterInput = {
  name: string;
  playerName?: string;
  speciesName: string;
  classDisplayName: string;
  subclass?: string | null;
  level?: number;
  background?: string;
  backgroundKey?: BackgroundSelectionKey;
  alignment?: string;
  baseStats?: Partial<Stats>;
  selectedSkills?: SkillName[];
  classEquipmentSelections?: Record<number, string>;
  hpMode?: HpMode;
  manualHpByLevel?: number[];
};

const MIN_STAT = 1;
const MAX_STAT = 20;

function clampStat(value: number | undefined, fallback: number): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.max(MIN_STAT, Math.min(MAX_STAT, Math.round(value)));
}

function getValidatedBaseStats(baseStats?: Partial<Stats>): Stats {
  return {
    strength: clampStat(baseStats?.strength, defaultStats.strength),
    dexterity: clampStat(baseStats?.dexterity, defaultStats.dexterity),
    constitution: clampStat(baseStats?.constitution, defaultStats.constitution),
    intelligence: clampStat(baseStats?.intelligence, defaultStats.intelligence),
    wisdom: clampStat(baseStats?.wisdom, defaultStats.wisdom),
    charisma: clampStat(baseStats?.charisma, defaultStats.charisma),
  };
}

function cloneItem<T>(value: T): T {
  if (value instanceof Set) {
    return new Set(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((entry) => cloneItem(entry)) as T;
  }
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneItem(entry)]),
    ) as T;
  }
  return value;
}

function addItem(
  equipment: Record<string, Item>,
  key: string,
  item: Item,
): void {
  const baseKey = key.replace(/\s+/g, "");
  const nextItem = cloneItem({ ...item, name: item.name ?? key });

  if (!equipment[baseKey]) {
    equipment[baseKey] = nextItem;
    return;
  }

  if (
    equipment[baseKey].name === nextItem.name &&
    typeof equipment[baseKey].quantity === "number" &&
    typeof nextItem.quantity === "number"
  ) {
    equipment[baseKey] = {
      ...equipment[baseKey],
      quantity: equipment[baseKey].quantity + nextItem.quantity,
    };
    return;
  }

  let suffix = 2;
  while (equipment[`${baseKey}${suffix}`]) suffix += 1;
  equipment[`${baseKey}${suffix}`] = nextItem;
}

function addChoiceItems(
  equipment: Record<string, Item>,
  key: string,
  choice: ChoiceItem,
): void {
  choice.items.forEach((item, index) => {
    addItem(equipment, choice.keys?.[index] ?? item.name ?? key, item);
  });
}

function addChoiceOption(
  equipment: Record<string, Item>,
  key: string,
  option: ChoiceOption,
): void {
  if ("grants" in option) {
    for (const [grantName, grant] of Object.entries(option.grants)) {
      grant.items.forEach((item, index) => {
        addItem(equipment, item.name ?? `${grantName}${index + 1}`, item);
      });
    }
    return;
  }

  addChoiceItems(equipment, key, option);
}

function calculateHitPoints(
  classDisplayName: string,
  level: number,
  baseStats: Stats,
  hpMode: HpMode | undefined,
  manualHpByLevel: number[] | undefined,
): number {
  const hitDie = DEFAULT_HIT_DIE_VALUE[classDisplayName] ?? 8;
  const conModifier = getModifier(baseStats.constitution);
  const levelOneHp = hitDie + conModifier;

  if (level <= 1) return Math.max(1, levelOneHp);

  if (hpMode === "manual") {
    const manualLevels = Array.from({ length: level - 1 }, (_, index) => {
      const value = manualHpByLevel?.[index];
      if (typeof value !== "number" || Number.isNaN(value)) return 1;
      return Math.max(1, Math.min(hitDie, Math.round(value)));
    });
    return Math.max(
      1,
      levelOneHp +
        manualLevels.reduce((total, value) => total + value + conModifier, 0),
    );
  }

  const averageHp = Math.floor(hitDie / 2) + 1;
  return Math.max(1, levelOneHp + (level - 1) * (averageHp + conModifier));
}

/**
 * Builds a playable Character shell for the sheet + feature merge pipeline.
 * Species must exist in {@link species} data; falls back to Human if missing.
 */
export function createCharacter(input: CreateCharacterInput): Character {
  const level = Math.min(20, Math.max(1, input.level ?? 1));
  const classDisplayName = input.classDisplayName.trim();
  const classStartingInfo = CLASS_STARTING_INFO[classDisplayName];
  const backgroundKey = input.backgroundKey ?? CUSTOM_BACKGROUND_KEY;
  const backgroundName =
    backgroundKey === CUSTOM_BACKGROUND_KEY
      ? input.background?.trim() || getBackgroundLabel(backgroundKey)
      : getBackgroundLabel(backgroundKey);
  const backgroundEquipment = getBackgroundStartingEquipment(backgroundKey);
  const baseStats = getValidatedBaseStats(input.baseStats);
  const equipment = { ...backgroundEquipment };
  const savingThrows = { ...defaultSavingThrows };
  const skills = Object.fromEntries(
    Object.entries(defaultSkills).map(([skillName, skill]) => [
      skillName,
      { ...skill },
    ]),
  ) as typeof defaultSkills;
  const proficiencies: Proficiencies = {
    armor: new Set(),
    weapons: new Set(),
    tools: new Set(),
    languages: new Set(),
  };

  if (classStartingInfo) {
    for (const stat of classStartingInfo.savingThrowProficiencies) {
      if (stat in savingThrows) {
        savingThrows[stat as keyof typeof savingThrows] = "proficient";
      }
    }

    for (const skill of input.selectedSkills ?? []) {
      if (classStartingInfo.skillProficiencies.from.has(skill)) {
        skills[skill] = { ...skills[skill], proficient: "proficient" };
      }
    }

    for (const proficiency of classStartingInfo.armorProficiencies) {
      proficiencies.armor.add(
        proficiency as Parameters<typeof proficiencies.armor.add>[0],
      );
    }
    for (const proficiency of classStartingInfo.weaponProficiencies) {
      proficiencies.weapons.add(
        proficiency as Parameters<typeof proficiencies.weapons.add>[0],
      );
    }
    for (const proficiency of classStartingInfo.toolProficiencies)
      proficiencies.tools.add(proficiency);

    for (const [key, choice] of Object.entries(
      classStartingInfo.startingEquipment.automatic,
    )) {
      addChoiceItems(equipment, key, choice);
    }

    classStartingInfo.startingEquipment.choices.forEach(
      (choiceGroup, index) => {
        const selectedKey = input.classEquipmentSelections?.[index];
        if (!selectedKey) return;
        const selectedOption = selectedKey
          ? choiceGroup.from[selectedKey]
          : undefined;
        if (selectedOption) {
          addChoiceOption(equipment, selectedKey, selectedOption);
        }
      },
    );
  }
  const fallbackName =
    SPECIES_DATA["Human"] !== undefined
      ? "Human"
      : (Object.keys(SPECIES_DATA)[0] ?? "");

  const resolved =
    resolveSpecies(input.speciesName.trim()) ??
    resolveSpecies("Human") ??
    (fallbackName ? resolveSpecies(fallbackName) : undefined);

  if (!resolved) {
    throw new Error("No species data available to create a character.");
  }

  const die = DEFAULT_HIT_DIE[classDisplayName] ?? "d8";
  const hp = calculateHitPoints(
    classDisplayName,
    level,
    baseStats,
    input.hpMode,
    input.manualHpByLevel,
  );
  proficiencies.languages = new Set(
    resolved.languages ? [...resolved.languages] : [],
  );

  return {
    name: input.name.trim() || "Unnamed",
    playerName: input.playerName?.trim() ?? "",
    race: resolved,
    background: backgroundName,
    alignment: input.alignment?.trim() ?? "True Neutral",
    class: classDisplayName,
    subclass: input.subclass?.trim() || undefined,
    level,
    baseStats,
    proficiencyBonus:
      proficiencyBonus[level as keyof typeof proficiencyBonus] ?? 2,
    inspiration: false,
    savingThrows,
    skills,
    speed: resolved.speed,
    proficiencies,
    hitPoints: {
      current: hp,
      max: hp,
      temporary: 0,
    },
    deathSaves: {
      successes: 0,
      failures: 0,
      isStabilized: false,
    },
    hitDice: {
      [die]: { total: level, used: 0 },
    },
    equipment,
    currency: {
      copper: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      electrum: 0,
    },
    features: {},
  };
}
