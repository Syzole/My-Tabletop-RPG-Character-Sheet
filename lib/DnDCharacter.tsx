import { ProficiencyLevel, SavingThrowProficiencyLevel, SkillProficiencies, Stats, SavingThrowProficiencies, Proficiencies, Modifier, Armor, feature } from "./types";
import { calculateSkillModifier, calculateSavingThrowModifier } from "./utils";
import {}  from "@prisma/client";

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

	baseStats: Stats; //this is the base baseStats
	stats: Stats; //this is baseStats plus modifiers from items, spells, etc
	armor?: Armor;
	proficiencyBonus: number;
	modifiers: Modifier[];

	skillProficiencies: SkillProficiencies;
	savingThrowProficiencies: SavingThrowProficiencies;
	proficiencies: Proficiencies;
	features?: feature[];

	initiative: number;

	inspiration?: string;

	passivePerception?: number;
	otherProficiencies?: string;

	ac?: number;
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


	// all below are optional and flavor text
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


	// spellcasting
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
		this.baseStats = {
			str: 10,
			dex: 10,
			con: 10,
			int: 10,
			wis: 10,
			cha: 10,
		};

		this.stats = { ...this.baseStats };

		this.initiative = this.getStatModifier("dex");

		this.proficiencyBonus = 2; // Example value, usually determined by character level

		this.modifiers = [];

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
		return calculateSkillModifier(this, skill);
	}

	calculateSavingThrowModifier(stat: keyof Stats): number {
		return calculateSavingThrowModifier(this, stat);
	}

	calculateAC(): number {
		let baseAC = this.armor ? this.armor.ac : 10;
		let dexModifier = this.getStatModifier("dex");

		if (this.armor && this.armor.maxDex !== undefined) {
			dexModifier = Math.min(dexModifier, this.armor.maxDex);
		}

		return baseAC + dexModifier;
	}

	getStatModifier(stat: keyof Stats): number {
		return Math.floor((this.stats[stat] - 10) / 2);
	}

	addModifier(modifier: Modifier) {
		this.modifiers.push(modifier);

		// Split the target string into keys
		const keys = modifier.target.split(".");
		let target = this;

		// Traverse the object to the target property
		for (let i = 0; i < keys.length - 1; i++) {
			if (!target[keys[i]]) {
				target[keys[i]] = {};
			}
			target = target[keys[i]];
		}

		// Modify the target property value
		target[keys[keys.length - 1]] += modifier.value;
	}

	removeModifier(type: string) {
		// Find the index of the modifier with the given type
		const index = this.modifiers.findIndex((mod) => mod.type === type);
		if (index === -1) {
			return; // Modifier not found
		}

		// Get the modifier to be removed
		const modifier = this.modifiers[index];

		// Split the target string into keys
		const keys = modifier.target.split(".");
		let target = this;

		// Traverse the object to the target property
		for (let i = 0; i < keys.length - 1; i++) {
			target = target[keys[i]];
		}

		// Revert the target property value
		target[keys[keys.length - 1]] -= modifier.value;

		// Remove the modifier from the array
		this.modifiers.splice(index, 1);
	}
}
