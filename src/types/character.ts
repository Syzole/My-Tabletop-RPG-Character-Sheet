import { Feature } from "@/types/feature";
import * as Items from "@/types/item";
import { Proficiencies } from "@/types/proficiencies";
import { SavingThrows } from "@/types/savingThrows";
import { Skills } from "@/types/skills";
import { CharacterSpellcasting } from "@/types/spellcasting";
import { Stats } from "@/types/stats";
import { Speed } from "@/types/speed";
import { Species } from "@/types/species";

export interface Character {
  name: string;
  playerName: string;
  race: Species;
  background: string; //TODO: make Background type
  alignment: string;
  class: string; // TODO: make Class type array
  /** Roguish Archetype, Sacred Oath, etc. Must match keys in SUBCLASS_FEATURE_MAP[class]. */
  subclass?: string;
  level: number;
  experiencePoints?: number;

  baseStats: Stats;

  proficiencyBonus: number; //TODO: Move to a live calculation based on level
  inspiration: boolean;
  savingThrows: SavingThrows;
  skills: Skills;

  speed: Speed;
  proficiencies: Proficiencies;

  hitPoints: {
    current: number;
    max: number;
    temporary: number;
  };

  deathSaves: {
    successes: number;
    failures: number;
    isStabilized: boolean;
  };

  hitDice: Record<string, { total: number; used: number }>; // Map of dice type (e.g., "d6", "d8", "d10") to {total, used}

  equipment: Record<string, Items.Item>; // Changed to a record for easier access name
  armor?: Items.Armor; // Single Armor object, since a character can typically wear only one armor at a time

  currency: {
    copper: number;
    silver: number;
    gold: number;
    platinum: number;
    electrum: number;
  };

  //some flavor text
  personalityTraits?: string[];
  ideals?: string[];
  bonds?: string[];
  flaws?: string[];

  /**
   * Owned class + subclass feature instances (cloned from catalogs at create / level-up).
   * Mutable fields like chargesUsed live here — catalogs stay read-only.
   */
  features?: Record<string, Feature>;

  /** Owned background feature instances (cloned at create when background data grants them). */
  backgroundFeatures?: Record<string, Feature>;

  feats?: Record<string, Feature>;

  spellcasting?: CharacterSpellcasting;
}
