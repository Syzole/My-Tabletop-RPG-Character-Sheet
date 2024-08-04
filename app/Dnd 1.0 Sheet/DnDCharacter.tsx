export enum ProficiencyLevel {
	None = "None",
	Proficient = "Proficient",
	Expertise = "Expertise",
}

enum SavingThrowProficiencyLevel {
	None = "None",
	Proficient = "Proficient",
}

interface Stats {
	str: number;
	dex: number;
	con: number;
	int: number;
	wis: number;
	cha: number;
}

interface SkillProficiencies {
	[key: string]: ProficiencyLevel;
}

interface SavingThrowProficiencies {
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

export default class DnDCharacter {
	[key: string]: any;

	name?: string;
	classLevel?: string;
	background?: string;
	playerName?: string;
	faction?: string;
	race?: string;
	alignment?: string;
	xp?: string;
	dciNo?: string;

	stats: Stats;
	proficiencyBonus: number;

	skillProficiencies: SkillProficiencies;
	savingThrowProficiencies: SavingThrowProficiencies;
	proficiencies: Proficiencies;

	inspiration?: string;
	passivePerception?: number;
	otherProficiencies?: string;

	ac?: string;
	speed?: string;

	maxHp?: string;
	hp?: string;
	tempHp?: string;

	hitDiceMax?: string;
	hitDice?: string;

	deathsaveSuccesses?: number;
	deathsaveFailures?: number;

	attacks?: any[];
	attacksText?: string;

	cp?: string;
	sp?: string;
	ep?: string;
	gp?: string;
	pp?: string;
	equipment?: string;
	equipment2?: string;

	personalityTraits?: string;
	ideals?: string;
	bonds?: string;
	flaws?: string;

	featuresTraits?: string;

	age?: string;
	height?: string;
	weight?: string;
	eyes?: string;
	skin?: string;
	hair?: string;

	appearance?: string;
	backstory?: string;

	factionImg?: string;
	factionRank?: string;
	allies?: string;
	allies2?: string;

	additionalFeatures?: string;
	additionalFeatures2?: string;

	totalNonConsumableMagicItems?: string;
	treasure?: string;
	treasure2?: string;

	spellcastingClass?: string;
	preparedSpellsTotal?: string;
	spellSaveDC?: string;
	spellAttackBonus?: string;

	cantrips?: any[];

	lvl1SpellSlotsTotal?: string;
	lvl1SpellSlotsUsed?: number;
	lvl1Spells?: any[];

	lvl2SpellSlotsTotal?: string;
	lvl2SpellSlotsUsed?: number;
	lvl2Spells?: any[];

	lvl3SpellSlotsTotal?: string;
	lvl3SpellSlotsUsed?: number;
	lvl3Spells?: any[];

	lvl4SpellSlotsTotal?: string;
	lvl4SpellSlotsUsed?: number;
	lvl4Spells?: any[];

	lvl5SpellSlotsTotal?: string;
	lvl5SpellSlotsUsed?: number;
	lvl5Spells?: any[];

	lvl6SpellSlotsTotal?: string;
	lvl6SpellSlotsUsed?: number;
	lvl6Spells?: any[];

	lvl7SpellSlotsTotal?: string;
	lvl7SpellSlotsUsed?: number;
	lvl7Spells?: any[];

	lvl8SpellSlotsTotal?: string;
	lvl8SpellSlotsUsed?: number;
	lvl8Spells?: any[];

	lvl9SpellSlotsTotal?: string;
	lvl9SpellSlotsUsed?: number;
	lvl9Spells?: any[];

	jackOfAllTrades: boolean;

	constructor() {
		this.stats = {
			str: 10,
			dex: 10,
			con: 10,
			int: 10,
			wis: 10,
			cha: 10,
		};

		this.proficiencyBonus = 2; // Example value, usually determined by character level

		this.skillProficiencies = {
			acrobatics: ProficiencyLevel.None,
			animalHandling: ProficiencyLevel.None,
			arcana: ProficiencyLevel.None,
			athletics: ProficiencyLevel.None,
			deception: ProficiencyLevel.None,
			history: ProficiencyLevel.None,
			insight: ProficiencyLevel.None,
			intimidation: ProficiencyLevel.None,
			investigation: ProficiencyLevel.None,
			medicine: ProficiencyLevel.None,
			nature: ProficiencyLevel.None,
			perception: ProficiencyLevel.None,
			performance: ProficiencyLevel.None,
			persuasion: ProficiencyLevel.None,
			religion: ProficiencyLevel.None,
			sleightOfHand: ProficiencyLevel.None,
			stealth: ProficiencyLevel.None,
			survival: ProficiencyLevel.None,
		};

		this.savingThrowProficiencies = {
			str: SavingThrowProficiencyLevel.None,
			dex: SavingThrowProficiencyLevel.None,
			con: SavingThrowProficiencyLevel.None,
			int: SavingThrowProficiencyLevel.None,
			wis: SavingThrowProficiencyLevel.None,
			cha: SavingThrowProficiencyLevel.None,
		};

		this.proficiencies = {
			armor: [],
			weapons: [],
			tools: [],
			languages: [],
		};

		this.jackOfAllTrades = false;
	}

	calculateSkillModifier(skill: keyof SkillProficiencies): number {
		const statModifier = this.getStatModifierForSkill(skill);
		let modifier = statModifier;

		switch (this.skillProficiencies[skill]) {
			case ProficiencyLevel.Proficient:
				modifier += this.proficiencyBonus;
				break;
			case ProficiencyLevel.Expertise:
				modifier += 2 * this.proficiencyBonus;
				break;
			default:
				if (this.jackOfAllTrades) {
					modifier += Math.floor(this.proficiencyBonus / 2);
				}
				break;
		}

		return modifier;
	}

	getInitiative(): number {
		let initiative = this.getStatModifier(this.stats.dex);
		if (this.jackOfAllTrades) {
			initiative += Math.floor(this.proficiencyBonus / 2);
		}
		return initiative;
	}

	private getStatModifierForSkill(skill: keyof SkillProficiencies): number {
		const statMapping: { [key in keyof SkillProficiencies]: keyof Stats } = {
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

		const stat = statMapping[skill];
		return this.getStatModifier(this.stats[stat]);
	}

	private getStatModifier(statValue: number): number {
		return Math.floor((statValue - 10) / 2);
	}
}
