export const proficiencyBonus = {
	1: 2,
	2: 2,
	3: 2,
	4: 2,
	5: 3,
	6: 3,
	7: 3,
	8: 3,
	9: 4,
	10: 4,
	11: 4,
	12: 4,
	13: 5,
	14: 5,
	15: 5,
	16: 5,
	17: 6,
	18: 6,
	19: 6,
	20: 6,
};

export const classes = {
	barbarian: "Barbarian",
	bard: "Bard",
	cleric: "Cleric",
	druid: "Druid",
	fighter: "Fighter",
	monk: "Monk",
	paladin: "Paladin",
	ranger: "Ranger",
	rogue: "Rogue",
	sorcerer: "Sorcerer",
	wizard: "Wizard",
	warlock: "Warlock",
};

export type classes = (typeof classes)[keyof typeof classes];