import { equipArmor, unequipArmor, updateAC, handleEquipWeapon } from "./helperFucntions/inventoryFunctions";
import { SavingThrowProficiencyLevel, Stats, SavingThrowProficiencies, Proficiencies, Item, Feature, skill, skills, defaultSkill, Armor, Race, StatModFromSource } from "./types";
import { calculateSkillModifier, calculateSavingThrowModifier } from "./utils";

export default class DnDCharacter {
	[ key: string ]: any;

	name?: string;
	classLevel?: string;
	background?: string;
	playerName?: string;
	faction?: string;
	race?: Race;
	alignment?: string;
	xp?: string;
	dciNo?: string;

	baseStats: Stats; //this is the base baseStats
	stats: Stats; //this is baseStats plus modifiers from items, spells, etc
	statMods: Stats = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 }; //this is the stats that are changed by items, spells, etc eg +2 str from a belt
	statModsFromSource: { [ key: string ]: StatModFromSource } = {};
	maxStats: Stats = { str: 20, dex: 20, con: 20, int: 20, wis: 20, cha: 20 };
	equippedArmor?: Armor;
	proficiencyBonus: number;

	skills: skills;
	savingThrowProficiencies: SavingThrowProficiencies;
	proficiencies: Proficiencies = this.initializeProficiencies();
	features: { [ key: string ]: Feature } = {};

	initiative: number;

	inspiration: number = 0;

	passivePerception?: number;
	otherProficiencies?: string;

	ac: number;
	speed: number = 30;

	maxHp: number = 0;
	hp: number = 0;
	tempHp: number = 0;

	hitDiceMax: { [ key: number ]: number } = {};
	hitDice: { [ key: number ]: number } = {};

	deathsaveSuccesses?: number;
	deathsaveFailures?: number;
	attacksText?: string;

	cp: number = 0;
	sp: number = 0;
	ep: number = 0;
	gp: number = 0;
	pp: number = 0;
	inventory: { [ key: string ]: Item } = {};
	equipment?: string;
	equippedWeapons: Item[] = [];

	personalityTraits: string = "";
	ideals: string = "";
	bonds: string = "";
	flaws: string = "";

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


	// Spellcasting
	spellcastingClass?: string;
	spellcastingAbilityMod?: number;
	preparedSpellsTotal?: number;
	spellSaveDC?: number;
	spellAttackBonus?: number;

	spellSlots: Map<number, { total: number, used: number }> = new Map();

	jackOfAllTrades: boolean;

	constructor(statBlock?: Stats) {
		this.baseStats = statBlock || { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
		this.stats = { ...this.baseStats };

		this.initiative = this.getStatModifier("dex");
		this.ac = 10 + this.getStatModifier("dex");

		this.proficiencyBonus = this.calculateProficiencyBonus();
		this.skills = this.initializeSkills();
		this.savingThrowProficiencies = this.initializeSavingThrowProficiencies();
		this.jackOfAllTrades = false;

		this.initSpellSlots();
	}

	calculateStatMods(): Stats {
		return {
			str: this.getStatModifier("str"),
			dex: this.getStatModifier("dex"),
			con: this.getStatModifier("con"),
			int: this.getStatModifier("int"),
			wis: this.getStatModifier("wis"),
			cha: this.getStatModifier("cha"),
		};
	}

	initializeSkills(): skills {
		return {
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
	}

	initializeSavingThrowProficiencies(): SavingThrowProficiencies {
		return {
			str: SavingThrowProficiencyLevel.None,
			dex: SavingThrowProficiencyLevel.None,
			con: SavingThrowProficiencyLevel.None,
			int: SavingThrowProficiencyLevel.None,
			wis: SavingThrowProficiencyLevel.None,
			cha: SavingThrowProficiencyLevel.None,
		};
	}

	initializeProficiencies(): Proficiencies {
		return {
			armor: new Set<string>(),
			weapons: new Set<string>(),
			tools: new Set<string>(),
			languages: new Set<string>(),
		};
	}

	calculateProficiencyBonus(): number {
		return 2 + Math.floor((this.level - 1) / 4);
	}

	initSpellSlots() {
		for (let i = 1; i <= 9; i++) {
			this.spellSlots.set(i, { total: 0, used: 0 });
		}
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


	getProficientSkills(): skills {
		const proficientSkills: skills = { ...this.skills };
		const proficientSkillsArray: skill[] = [];
		for (const skill in this.skills) {
			if (this.skills[ skill ].proficient) {
				proficientSkillsArray.push(this.skills[ skill ]);
			}
		}

		return proficientSkills;
	}

	public static fromJSON(json: any): DnDCharacter {

		let charecter: DnDCharacter;

		if (json.baseStats) {
			charecter = new DnDCharacter(json.baseStats);
		} else {
			charecter = new DnDCharacter();
		}

		Object.assign(charecter, json);
		return charecter;
	}
}
