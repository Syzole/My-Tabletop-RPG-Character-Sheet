/**
 * Examples of `CharacterSpellcasting`: full `Spell` objects live on the character.
 * - Standard casters: set `leveledSlots` only.
 * - Warlock: set `pactSlots` only (or both when multiclassed with a leveled caster).
 */
import { castingTimeType, Spell, SpellLevel, SpellSchool } from "@/types/spell";
import { CharacterSpellcasting } from "@/types/spellcasting";
import { DamageType } from "@/types/damage";
import { statName } from "@/types/stats";
import { classes } from "@/constants/character";
import { castSpell } from "@/utils/spell";

const fireBolt: Spell = {
	name: "Fire Bolt",
	level: SpellLevel.Cantrip,
	school: SpellSchool.Evocation,
	castingTime: { type: castingTimeType.Action },
	range: { type: "point", distance: { type: "feet", amount: 120 } },
	components: { verbal: true, somatic: true },
	duration: [{ type: "instant" }],
	description:
		"You hurl a mote of fire at a creature or object within range. Make a ranged spell attack.",
	isAttackRoll: "ranged",
	damage: { diceCount: 1, diceValue: 10, type: DamageType.Fire },
	scaling: { mode: "characterLevel" },
};

const magicMissile: Spell = {
	name: "Magic Missile",
	level: SpellLevel.First,
	school: SpellSchool.Evocation,
	castingTime: { type: castingTimeType.Action },
	range: { type: "point", distance: { type: "feet", amount: 120 } },
	components: { verbal: true, somatic: true },
	duration: [{ type: "instant" }],
	description:
		"You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range.",
	damage: { diceCount: 1, diceValue: 4, type: DamageType.Force },
	scaling: { mode: "slot", baseLevel: SpellLevel.First, diceBySlot: { count: 1, diceValue: 4 } },
};

const eldritchBlast: Spell = {
	name: "Eldritch Blast",
	level: SpellLevel.Cantrip,
	school: SpellSchool.Evocation,
	castingTime: { type: castingTimeType.Action },
	range: { type: "point", distance: { type: "feet", amount: 120 } },
	components: { verbal: true, somatic: true },
	duration: [{ type: "instant" }],
	description: "A beam of crackling energy streaks toward a creature within range.",
	isAttackRoll: "ranged",
	damage: { diceCount: 1, diceValue: 10, type: DamageType.Force },
	scaling: { mode: "characterLevel" },
};

const hex: Spell = {
	name: "Hex",
	level: SpellLevel.First,
	school: SpellSchool.Enchantment,
	castingTime: { type: castingTimeType.BonusAction },
	range: { type: "point", distance: { type: "feet", amount: 90 } },
	components: { verbal: true, somatic: true, material: "the petrified eye of a newt" },
	duration: [{ type: "timed", duration: { type: "hour", amount: 1 }, concentration: true }],
	description:
		"You place a curse on a creature that you can see within range. Until the spell ends, you deal an extra 1d6 necrotic damage to the target when you hit it with an attack.",
};

const shield: Spell = {
	name: "Shield",
	level: SpellLevel.First,
	school: SpellSchool.Abjuration,
	castingTime: { type: castingTimeType.Reaction },
	range: { type: "point", distance: { type: "self" } },
	components: { verbal: true, somatic: true },
	duration: [{ type: "timed", duration: { type: "round", amount: 1 } }],
	description:
		"An invisible barrier of magical force appears and protects you. Until the start of your next turn, you have a +5 bonus to AC.",
};

const burningHands: Spell = {
	name: "Burning Hands",
	level: SpellLevel.First,
	school: SpellSchool.Evocation,	
	castingTime: { type: castingTimeType.Action },
	range: { type: "cone", distance: { type: "feet", amount: 15 } },
	components: { verbal: true, somatic: true },
	duration: [{ type: "instant" }],
	description: "You hurl your hands toward a creature you can see within range. Each target must succeed on a Dexterity saving throw or take 1d6 fire damage.",
	damage: { diceCount: 3, diceValue: 6, type: DamageType.Fire },
	saveAbility: statName.Dexterity,
};

/** Wizard-style: leveled slots only, no pact block. */
export const exampleWizardSpellcasting: CharacterSpellcasting = {
	spells: {
		[fireBolt.name]: {
			spell: fireBolt,
			source: classes.wizard,
			ability: statName.Intelligence,
		},
		[magicMissile.name]: {
			spell: magicMissile,
			source: classes.wizard,
			ability: statName.Intelligence,
		},
	},
	leveledSlots: {
		1: { used: 1, max: 4 },
		2: { used: 0, max: 3 },
	},
};

export const exampleSorcererSpellcasting: CharacterSpellcasting = {
	spells: {
		[fireBolt.name]: {
			spell: fireBolt,
			source: classes.sorcerer,
			ability: statName.Charisma,
		},
		[magicMissile.name]: {
			spell: magicMissile,
			source: classes.sorcerer,
			ability: statName.Charisma,
		},
		[burningHands.name]: {
			spell: burningHands,
			source: classes.sorcerer,
			ability: statName.Charisma,
		},
	},
	leveledSlots: {
		1: { used: 1, max: 4 },
		2: { used: 0, max: 3 },
	},
};

/** Warlock-style: pact slots only (same level, short-rest refresh in play). */
export const exampleWarlockSpellcasting: CharacterSpellcasting = {
	spells: {
		[eldritchBlast.name]: {
			spell: eldritchBlast,
			source: classes.warlock,
			ability: statName.Charisma,
			
		},
		[hex.name]: {
			spell: hex,
			source: classes.warlock,
			ability: statName.Charisma,
			
		},
	},
	pactSlots: {
		slotLevel: 2,
		max: 2,
		used: 0,
	},
};

/** Sorcerer 3 / Warlock 1 style: combined leveled pool + separate pact slots. */
export const exampleMulticlassSpellcasting: CharacterSpellcasting = {
	spells: {
		[fireBolt.name]: {
			spell: fireBolt,
			source: classes.sorcerer,
			ability: statName.Charisma,
		},
		[magicMissile.name]: {
			spell: magicMissile,
			source: classes.wizard,
			ability: statName.Intelligence,
		},
		[eldritchBlast.name]: {
			spell: eldritchBlast,
			source: classes.warlock,
			ability: statName.Charisma,
		},	
		[hex.name]: {
			spell: hex,
			source: classes.warlock,
			ability: statName.Charisma,
		},
	},
	leveledSlots: {
		1: { used: 0, max: 4 },
		2: { used: 0, max: 2 },
	},
	pactSlots: {
		slotLevel: 1,
		max: 1,
		used: 0,
	},
};

/** Feat example (Magic Initiate style): one free cast per long rest. */
export const exampleMagicInitiateSpellcasting: CharacterSpellcasting = {
	spells: {
		[fireBolt.name]: {
			spell: fireBolt,
			source: "Feat",
			ability: statName.Intelligence,
		},
		[magicMissile.name]: {
			spell: magicMissile,
			source: "Feat",
			ability: statName.Intelligence,
		},
		[shield.name]: {
			spell: shield,
			source: "Feat",
			ability: statName.Intelligence,
			freeCasts: {
				max: 1,
				used: 0,
				reset: "longRest",
				canUseSlotsAfterFreeCasts: true,
			},
		},
	},
	leveledSlots: {
		1: { used: 0, max: 2 },
	},
};

export const exampleWarlockSorcererSpellcasting: CharacterSpellcasting = {
	spells: {
		[eldritchBlast.name]: {
			spell: eldritchBlast,
			source: classes.warlock,
			ability: statName.Charisma,
		},
		[burningHands.name]: {
			spell: burningHands,
			source: classes.sorcerer,
			ability: statName.Charisma,
		},
		[magicMissile.name]: {
			spell: magicMissile,
			source: classes.sorcerer,
			ability: statName.Charisma,
		},
	},
	pactSlots: {
		slotLevel: 2,
		max: 2,
		used: 0,
	},
	leveledSlots: {
		1: { used: 0, max: 2 },
		2: { used: 0, max: 2 },
	},
};