import { equipArmor, unequipArmor, updateAC, handleEquipWeapon } from "./helperFucntions/inventoryFunctions";
import { SavingThrowProficiencyLevel, Stats, SavingThrowProficiencies, Proficiencies, Item, feature, skills, defaultSkill, Armor, Weapon } from "./types";
import { calculateSkillModifier, calculateSavingThrowModifier } from "./utils";

export default class DnDCharacter {
	[ key: string ]: any;

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
	equippedArmor?: Armor;
	proficiencyBonus: number;

	skills: skills;
	savingThrowProficiencies: SavingThrowProficiencies;
	proficiencies: Proficiencies;
	features: feature[] = [];

	initiative: number;

	inspiration?: number;

	passivePerception?: number;
	otherProficiencies?: string;

	ac: number;
	speed?: number;

	maxHp?: number;
	hp?: number;
	tempHp?: number;

	hitDiceMax?: string;
	hitDice?: string;

	deathsaveSuccesses?: number;
	deathsaveFailures?: number;
	attacksText?: string;

	cp?: number;
	sp?: number;
	ep?: number;
	gp?: number;
	pp?: number;
	inventory: Item[] = [];
	equipment?: string;
	equippedWeapons: Item[] = [];

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

		this.ac = 10 + this.getStatModifier("dex");

		this.proficiencyBonus = 2; // Example value, usually determined by character level

		this.modifiers = [];

		this.skills = {
			acrobatics: defaultSkill("acrobatics"),
			animalHandling: defaultSkill("animalHandling"),
			arcana: defaultSkill("arcana"),
			athletics: defaultSkill("athletics"),
			deception: defaultSkill("deception"),
			history: defaultSkill("history"),
			insight: defaultSkill("insight"),
			intimidation: defaultSkill("intimidation"),
			investigation: defaultSkill("investigation"),
			medicine: defaultSkill("medicine"),
			nature: defaultSkill("nature"),
			perception: defaultSkill("perception"),
			performance: defaultSkill("performance"),
			persuasion: defaultSkill("persuasion"),
			religion: defaultSkill("religion"),
			sleightOfHand: defaultSkill("sleightOfHand"),
			stealth: defaultSkill("stealth"),
			survival: defaultSkill("survival"),
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

	calculateSkillModifier(skill: keyof skills): number {
		return calculateSkillModifier(this, skill);
	}

	calculateSavingThrowModifier(stat: keyof Stats): number {
		return calculateSavingThrowModifier(this, stat);
	}

	equipArmor(armor: Armor): number {
		return equipArmor(this, armor);
	}

	// Unequip armor, reset AC to base
	unequipArmor(): number {
		return unequipArmor(this);
	}

	handleEquipWeapon(weapon: Item) {
		handleEquipWeapon(this, weapon);
	}

	// Update AC based on the equipped armor and Dexterity modifier
	updateAC(): number {
		return updateAC(this);
	}

	getStatModifier(stat: keyof Stats): number {
		return Math.floor((this.stats[ stat ] - 10) / 2);
	}

}
