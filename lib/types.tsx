// types.ts

import DnDCharacter from "./DnDCharacter";
import * as types from "@prisma/client"

export type feature = types.Subclass_Feature | types.Class_Feature

export interface Modifier {
	type: string;
	target: string;
	value: number; // To store the value of the modifier for easier removal
}

export interface Weapon{
	name: string;
	damage: string;
	properties: string[];
	weight: string;
	description: string;
}

export interface Armor {
	type: "Light" | "Medium" | "Heavy";
	ac: number;
	maxDex?: number;
	strReq?: number;
	disadvantage?: boolean;
	weight: number;
}

export enum ProficiencyLevel {
	None = "None",
	Proficient = "Proficient",
	Expertise = "Expertise",
}

export enum SavingThrowProficiencyLevel {
	None = "None",
	Proficient = "Proficient",
}

export interface Stats {
	[key: string]: number;
	str: number;
	dex: number;
	con: number;
	int: number;
	wis: number;
	cha: number;
}

export interface SkillProficiencies {
	[key: string]: ProficiencyLevel;
	acrobatics: ProficiencyLevel;
	animalHandling: ProficiencyLevel;
	arcana: ProficiencyLevel;
	athletics: ProficiencyLevel;
	deception: ProficiencyLevel;
	history: ProficiencyLevel;
	insight: ProficiencyLevel;
	intimidation: ProficiencyLevel;
	investigation: ProficiencyLevel;
	medicine: ProficiencyLevel;
	nature: ProficiencyLevel;
	perception: ProficiencyLevel;
	performance: ProficiencyLevel;
	persuasion: ProficiencyLevel;
	religion: ProficiencyLevel;
	sleightOfHand: ProficiencyLevel;
	stealth: ProficiencyLevel;
	survival: ProficiencyLevel;
}

export interface SavingThrowProficiencies {
	[key: string]: SavingThrowProficiencyLevel;
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