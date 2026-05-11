import { DamageType } from "@/types/damage";
import { statName } from "@/types/stats";
import { rechargeType } from "@/types/feature";


export const SpellSchool = {
	Abjuration: "Abjuration",
	Conjuration: "Conjuration",
	Divination: "Divination",
	Enchantment: "Enchantment",
	Evocation: "Evocation",
	Illusion: "Illusion",
	Necromancy: "Necromancy",
	Transmutation: "Transmutation",
} as const;

export type SpellSchool = (typeof SpellSchool)[keyof typeof SpellSchool];

export const SpellLevel = {
	Cantrip: 0,
	First: 1,
	Second: 2,
	Third: 3,
	Fourth: 4,
	Fifth: 5,
	Sixth: 6,
	Seventh: 7,
	Eighth: 8,
	Ninth: 9,
} as const;

export type SpellLevel = (typeof SpellLevel)[keyof typeof SpellLevel];

export const castingTimeType = {
    Action: "Action",
    BonusAction: "Bonus Action",
    Reaction: "Reaction",
	Minute: "Minute",
	Hour: "Hour",
	Special: "Special",
} as const;

export type castingTimeType = (typeof castingTimeType)[keyof typeof castingTimeType];

export interface castingTime {
	type: castingTimeType;
	amount?: number; // for minute and hour types
}

export interface SpellScaling {
	mode: "none" | "slot" | "characterLevel";
	baseLevel?: SpellLevel; // for slot‑based
	
	damageByLevel?: Record<number, { diceCount: number; diceValue: number }>; // Acid Splash
	
	diceBySlot?:{
		count: number;
		diceValue: number;
	}

	maxLevel?: number; // max level of the spell it can be cast at (ex: hail of thorns at level 6)
}

export interface SpellComponents {
	verbal: boolean;
	somatic: boolean;
	material?: string; // text description
}

export interface Spell {
	name: string; //this might also be a key in a map where key is name and value is spell
	level: SpellLevel;
	school: SpellSchool;

	castingTime: castingTime; // "1 action", "1 bonus action", "1 reaction", "1 minute", "10 minutes", "1 hour", "8 hours"
	range: {
		type: 'hemisphere' | 'line' | 'cube' | 'emanation' | 'cone' | 'sphere' | 'special' | 'point' | 'radius'; 
		distance:{
			type: 'feet' | 'unlimited' | 'touch' | 'sight' | 'self' | 'miles' | 'custom'; 
			amount?: number;
		}
	};

	components: SpellComponents;
	
	
	duration: { //This is an array incase of spells that have multiple duration options like control flames
		type: 'permanent' | 'special' | 'timed' | 'instant';
		duration?: {
			type: 'minute' | 'round' | 'day' | 'hour';
			amount?: number;
		}
		concentration?: boolean;
	}[];

	ritual?: boolean;

	description: string; // full rules text as a blob

	damage?: {
		diceCount: number;
		diceValue: number;
		type?: DamageType;
	};

	saveAbility?: statName;
	isAttackRoll?: "melee" | "ranged";

	scaling?: SpellScaling;

	recharge?: typeof rechargeType.Long;

	// taxonomy / source info (optional)
	classes?: string[];
	subclasses?: string[];
	feats?: string[];
	species?: string[];
	backgrounds?: string[];
	sources?: string[]; // ["PHB'24 p247", "SRD 5.2.1"]
	entries?: Array<string | object>; // either a string or an object
	entriesHigherLevel?: Array<string | object>; // either a string or an object
}