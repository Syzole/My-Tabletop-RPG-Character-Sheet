import { Stats } from "./stats";

export type SkillName =
	| "acrobatics"
	| "animalHandling"
	| "arcana"
	| "athletics"
	| "deception"
	| "history"
	| "insight"
	| "intimidation"
	| "investigation"
	| "medicine"
	| "nature"
	| "perception"
	| "performance"
	| "persuasion"
	| "religion"
	| "sleightOfHand"
	| "stealth"
	| "survival";

export interface Skill {
	stat: keyof Stats;
	proficient: "none" | "proficient" | "expertise" | "halfProficient";
	advantage?: "normal" | "advantage" | "disadvantage";
}

// Make sure these keys match exactly with those defined in Stats
export const skillStatMap: Record<SkillName, keyof Stats> = {
	acrobatics: "dexterity",
	animalHandling: "wisdom",
	arcana: "intelligence",
	athletics: "strength",
	deception: "charisma",
	history: "intelligence",
	insight: "wisdom",
	intimidation: "charisma",
	investigation: "intelligence",
	medicine: "wisdom",
	nature: "intelligence",
	perception: "wisdom",
	performance: "charisma",
	persuasion: "charisma",
	religion: "intelligence",
	sleightOfHand: "dexterity",
	stealth: "dexterity",
	survival: "wisdom",
};

export type Skills = Record<SkillName, Skill>;

export const defaultSkills: Skills = Object.keys(skillStatMap).reduce((acc, skillName) => {
	acc[skillName as SkillName] = {
		stat: skillStatMap[skillName as SkillName],
		proficient: "none",
		advantage: "normal",
	};
	return acc;
}, {} as Skills);
