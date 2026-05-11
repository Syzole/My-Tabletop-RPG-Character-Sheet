export interface Stats {
	strength: number;
	dexterity: number;
	constitution: number;
	intelligence: number;
	wisdom: number;
	charisma: number;
}

export const defaultStats: Stats = {
	strength: 10,
	dexterity: 10,
	constitution: 10,
	intelligence: 10,
	wisdom: 10,
	charisma: 10,
};

export const defaultStatModifiers: Stats = {
	strength: 0,
	dexterity: 0,
	constitution: 0,
	intelligence: 0,
	wisdom: 0,
	charisma: 0,
};

export const statName = {
	Strength: "strength",
	Dexterity: "dexterity",
	Constitution: "constitution",
	Intelligence: "intelligence",
	Wisdom: "wisdom",
	Charisma: "charisma",
} as const;

export type statName = (typeof statName)[keyof typeof statName];
