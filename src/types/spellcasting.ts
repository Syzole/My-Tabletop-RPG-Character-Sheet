import { Spell } from "@/types/spell";
import { statName } from "@/types/stats";
import { classes } from "@/constants/character";

/**
 * Standard spell slots (full / half / third caster and multiclass combined table).
 * Keys are spell levels 1–9; values track used vs maximum for that level.
 */
export type LeveledSpellSlotPool = Record<number, { used: number; max: number }>;

/**
 * Warlock Pact Magic: every slot is the same spell level and they refresh on a short rest
 * (separate from the leveled pool used by wizard / sorcerer / multiclass slots).
 */
export interface PactMagicSlots {
	/** Spell level every pact slot counts as (e.g. 2 for a 3rd–4th level warlock). */
	slotLevel: number;
	max: number;
	used: number;
}

export interface CharacterSpellEntry {
	spell: Spell;
	source: classes | "Race" | "Feat";
	ability: statName;
	/**
	 * Optional free-cast tracking for grants like Magic Initiate:
	 * "You can cast this spell once per long rest without expending a spell slot."
	 */
	freeCasts?: {
		max: number;
		used: number;
		reset: "shortRest" | "longRest" | "dawn" | "other";
		/**
		 * If true, this spell can also be cast using the assigned slotPool
		 * after free uses are spent.
		 */
		canUseSlotsAfterFreeCasts?: boolean;
	};
}

/**
 * All spell definitions live on the character (offline-friendly).
 * Use `leveledSlots` for normal progression, `pactSlots` when the character has Pact Magic.
 * Multiclass sorcerer/warlock typically has both.
 */
export interface CharacterSpellcasting {
	spells: Record<string, CharacterSpellEntry>;
	leveledSlots?: LeveledSpellSlotPool;
	pactSlots?: PactMagicSlots;
}
