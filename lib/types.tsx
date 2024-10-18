// types.ts

import * as types from "@prisma/client";
import DnDCharacter from "./DnDCharacter";

export type Feature = {
	feature_name: string;
	source_name: string;
	level?: number;
	description: string;
	properties?: {
		[ key: string ]: any
		modifiers?: Modifier[];
		charges?: number;
		chargesUsed?: number;
		dynamic?: { [ key: string ]: any }; // e.g., { "charges": "proficiencyBonus" }
		recharge?: "short" | "long" | "other" | "N/A"; // short or long rest
	};
	type: types.featureType;
}

export type Modifier = {
	// For attack rolls, damage, or other types of effects
	statAffected: string;    // e.g., "attackBonus", "damageBonus", "ac", etc.
	condition?: (character: DnDCharacter, target?: any) => boolean;      // e.g., "isRanged", "isMelee", "weaponType == 'Ranged'", etc.
	value: number | ((character: DnDCharacter) => number) | string;            // e.g., +2 for Archery, +1 for defense, etc.
};

export interface Weapon {
	name: string;
	rangeType: "Melee" | "Ranged";
	damage: string;
	damageType: string;
	properties: { [ key: string ]: any };
}

export interface Armor {
	name: string;
	type: "Light" | "Medium" | "Heavy";
	ac: number;
	maxDex?: number;
	strReq?: number;
	disadvantage?: boolean;
	weight: number;
}

export interface Item {
	[ key: string ]: any;
	name: string;
	source: string[];
	type: string;
	rarity?: string;
	value?: number;
	weight?: number;
	quantity: number;
	features?: Feature[];
	properties: { [ key: string ]: any };
}

export enum ProficiencyLevel {
	None = "None",
	Proficient = "Proficient",
	halfProficient = "halfProficient",
	Expertise = "Expertise",
}

export enum SavingThrowProficiencyLevel {
	None = "None",
	Proficient = "Proficient",
}

export interface Stats {
	[ key: string ]: number;
	str: number;
	dex: number;
	con: number;
	int: number;
	wis: number;
	cha: number;
}

export interface SavingThrowProficiencies {
	[ key: string ]: SavingThrowProficiencyLevel;
	str: SavingThrowProficiencyLevel;
	dex: SavingThrowProficiencyLevel;
	con: SavingThrowProficiencyLevel;
	int: SavingThrowProficiencyLevel;
	wis: SavingThrowProficiencyLevel;
	cha: SavingThrowProficiencyLevel;
}

export interface Proficiencies {
	armor: string[];
	weapons: string[];
	tools: string[];
	languages: string[];
}

export interface skills {
	[ key: string ]: skill;
	acrobatics: skill;
	animalHandling: skill;
	arcana: skill;
	athletics: skill;
	deception: skill;
	history: skill;
	insight: skill;
	intimidation: skill;
	investigation: skill;
	medicine: skill;
	nature: skill;
	perception: skill;
	performance: skill;
	persuasion: skill;
	religion: skill;
	sleightOfHand: skill;
	stealth: skill;
	survival: skill;
}

type skill = {
	stat: string;
	proficient: ProficiencyLevel;
	advantage: string;
}

//default constructor for skill
export const defaultSkill = (skill: string) => (
	{
		stat: statMapping[ skill ],
		proficient: ProficiencyLevel.None,
		advantage: "normal",
	} as skill
);

const statMapping: { [ key in keyof skills ]: keyof Stats } = {
	acrobatics: "dex",
	animalHandling: "wis",
	arcana: "int",
	athletics: "str",
	deception: "cha",
	history: "int",
	insight: "wis",
	intimidation: "cha",
	investigation: "int",
	medicine: "wis",
	nature: "int",
	perception: "wis",
	performance: "cha",
	persuasion: "cha",
	religion: "int",
	sleightOfHand: "dex",
	stealth: "dex",
	survival: "wis",
};

export type Race = {
	name: string;
	abilityScoreIncrease: Stats;
	speed: number;
	size: string;
	proficiencies: Proficiencies;
	features: { [ key: string ]: Feature };
	languages: string[];
}