// types.ts

import * as types from "@prisma/client";

export type Feature = {
	feature_name: string;
	source?: string;
	description: string;
	properties?: {
		[ key: string ]: any
		charges?: number;
		chargesUsed?: number;
		dynamic?: { [ key: string ]: string }; // e.g., { "charges": "proficiencyBonus" }
		recharge?: "Short" | "Long" | "Other" | "Dawn" | "N/A"; // short or long rest
	};
	type: types.featureType;
}

export interface Weapon {
	name: string;
	rangeType: "Melee" | "Ranged";
	damage: string;
	damageType: string;
	properties: { [ key: string ]: any };
	features?: { [ key: string ]: Feature };
}

export interface Armor {
	name: string;
	type: "Light" | "Medium" | "Heavy" | "Other";
	ac: number;
	maxDex?: number; // max dex bonus from armor
	strReq?: number;
	disadvantage?: boolean;
	weight: number;
	features?: { [ key: string ]: Feature };
}

export interface Shield {
	name: string;
	ac: number;
	weight: number;
	features?: { [ key: string ]: Feature };
}

export interface Item {
	[ key: string ]: any;
	name: string;
	source?: string[];
	type: string;
	rarity?: string;
	value?: number;
	weight?: number;
	quantity: number;
	features?: { [ key: string ]: Feature };
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

export interface StatModFromSource {
	//this will tell what is the name of the source, what stat it modifies and by how much
	source: string;
	stat: keyof Stats;
	modifier: number;
	id?: number;
};

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
	armor: Set<string>;
	weapons: Set<string>;
	tools: Set<string>;
	languages: Set<string>;
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

export type skill = {
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
	modifiers?: { [ key: string ]: any };
}

export type Spell = {
	name: string;
	level: number;
	school: string;
	castingTime: string;
	range: string;
	components: string[];
	damagediceOrSavingThrow: string;
	duration: string;
	description: string;
	spellModifier: string;
}

export enum ClassType {
	Wizard = "Wizard",
	Sorcerer = "Sorcerer",
	Bard = "Bard",
	Cleric = "Cleric",
	Druid = "Druid",
	Paladin = "Paladin",
	Ranger = "Ranger",
	Warlock = "Warlock",
	Fighter = "Fighter",
	Rogue = "Rogue",
	Barbarian = "Barbarian",
	Monk = "Monk"
}

export enum SpellLevel {
	Cantrip = 0,
	Level1 = 1,
	Level2 = 2,
	Level3 = 3,
	Level4 = 4,
	Level5 = 5,
	Level6 = 6,
	Level7 = 7,
	Level8 = 8,
	Level9 = 9,
}
