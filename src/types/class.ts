import { ItemType } from "@/types/item";
import { SkillName } from "@/types/skills";
import { statName } from "@/types/stats";
import { Feature } from "./feature";

export interface ChoiceItem {
  keys?: string[]; // optional keys for multi-item picks
  items: ItemType[]; // always an array, even for single items
}

/** A single grant entry (named set of items). Used inside grants. */
export interface GrantEntry {
  items: ItemType[];
}

/** One option in a "choose from" list. Either a flat ChoiceItem or multiple named grants. */
export type ChoiceOption =
  | ChoiceItem
  | { grants: Record<string, GrantEntry> };

export interface ClassingStartingInfo {
  savingThrowProficiencies: Set<string>;
  skillProficiencies: {
    choose: number;
    from: Set<SkillName>;
  };

  weaponProficiencies: Set<string>;
  toolProficiencies: Set<string>;
  armorProficiencies: Set<string>;

  startingEquipment: {
    automatic: Record<string, ChoiceItem>;
    choices: Array<{
      choose: number;
      from: Record<string, ChoiceOption>;
    }>;
  };

  startingGold: string;
}

export interface Class {
  name: string;
  hitDice: number;
  
  startingInfo: ClassingStartingInfo;

  features: Record<string, Feature>;

  spellCasterLevel?: number;
	spellCastingAbility?: statName;
}

