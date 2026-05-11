import { Stats } from "./stats";

export type SavingThrowProficiencyLevel = "none" | "proficient";

export type SavingThrows = {
	[K in keyof Stats]: SavingThrowProficiencyLevel;
};

export const defaultSavingThrows: SavingThrows = {
	strength: "none",
	dexterity: "none",
	constitution: "none",
	intelligence: "none",
	wisdom: "none",
	charisma: "none",
};
