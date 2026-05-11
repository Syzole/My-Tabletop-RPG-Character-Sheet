import { Stats } from "./stats";
import { AttackType, DamageType } from "./damage";
import { WeaponCategories, WeaponProperties } from "./weapon";
import { armorType } from "./armor";
import { WeaponType } from "@/types/weapon";

export interface Item {
	name?: string;
	description?: string[];
	entries?: Array<string | ItemEntry>; // Full description entries
	source?: string[]; // Source book or creator
	quantity?: number;
	equipped?: boolean;
	weight?: number;
	value?: number; // Cost in gold pieces
	rarity: itemRarity;
	requiresAttunement?: boolean;
	isAttuned?: boolean; // Track attunement status
	statModifiers?: Partial<Stats>;

	// Enhanced fields
	magic?: boolean;
	isCustom?: boolean;
	isHomebrew?: boolean;
	canEquip?: boolean;
	// avatarUrl?: string;
	// largeAvatarUrl?: string;
	tags?: string[]; // e.g., ["Damage", "Combat"]
	sources?: Array<{
		sourceId: number;
		pageNumber?: number;
		name: string;
	}>;
	notes?: string; // Player notes
	chargesUsed?: number; // For items with limited uses
	limitedUse?: {
		maxUses: number;
		chargesUsed: number;
		resetType: "shortRest" | "longRest" | "dawn" | "other";
	};
}



export interface ItemEntry {
	type: "text" | "list" | "item";
	name?: string; // optional title like "Ability"
	entries?: Array<string | ItemEntry>; // recursive
	style?: string; // optional formatting
}

export interface Weapon extends Item {
	damage: {
		diceCount: number; // e.g., 1 for 1d8
		diceValue: number; // e.g., 8 for 1d8
		type: typeof DamageType.Slashing | typeof DamageType.Piercing | typeof DamageType.Bludgeoning; // e.g., "slashing", "piercing"
		fixedValue?: number; // Additional fixed damage
	};

	attackType: AttackType;
	weaponType: WeaponType; // e.g., "longsword", "shortbow"
	category: WeaponCategories;

	range?: {
		normal?: number; // Normal range
		long?: number; // Long range (disadvantage)
	};

	attackBonus?: number;
	reach?: number; // Weapon reach in feet (default 5)

	// Versatile damage (two-handed use)
	versatileDamage?: {
		diceCount: number;
		diceValue: number;
		//we assume the type is the same as the main damage type
	};

	// Additional damage sources
	additionalDamages?: Array<{
		diceCount: number;
		diceValue: number;
		type: DamageType;
		condition?: string; // e.g., "vs undead"
	}>;

	// Material and enhancement flags
	silvered?: boolean;
	adamantine?: boolean;

	// Combat features
	isMonkWeapon?: boolean;
	canOffhand?: boolean; // Can be used in off-hand
	isHexWeapon?: boolean; // Warlock hex weapon
	isPactWeapon?: boolean; // Warlock pact weapon
	isDedicatedWeapon?: boolean; // Dedicated weapon feature

	// Mastery property (2024 rules)
	mastery?: string;

	// Proficiency override
	proficiencyOverride?: boolean;

	// Spells granted by weapon
	spells?: Array<{
		name: string;
		level: number;
		usesPerDay?: number; //i also recomend adding a spell type to this over time
	}>;

	// Enhanced properties with full data
	properties?: Set<WeaponProperties>;

	
}

export interface Armor extends Item {
	armorClass: number;
	type: typeof armorType.Light | typeof armorType.Medium | typeof armorType.Heavy;
	stealthDisadvantage?: boolean;
	maxDexBonus?: number;
	strengthRequirement?: number;

	// Enhanced armor features
	acBonus?: number; // Additional AC beyond base
	magicalBonus?: number; // +1, +2, +3 etc.

	// The armor might give the user some resistances or immunities, so add those
	resistances?: Set<DamageType>; // Damage resistances
	immunities?: Set<DamageType>; // Damage immunities
	vulnerabilities?: Set<DamageType>; // Damage vulnerabilities
}

export interface Shield extends Item {
	acBonus: number; // Usually +2
	magicalBonus?: number;
	specialProperties?: string[];
}

export interface Consumable extends Item {
	effect: string;
	uses: number;
	maxUses: number;
	diceCount?: number;
	diceValue?: number;
	quantity: number; // Number of uses or charges left

	// Enhanced consumable features
	consumableType: "potion" | "scroll" | "ammunition" | "other";
	spellLevel?: number; // For spell scrolls
	spellName?: string; // For spell scrolls
	healingDice?: {
		diceCount: number;
		diceValue: number;
		bonus: number;
	};

	// Activation
	activationType?: "action" | "bonus" | "reaction" | "minute" | "hour";
	activationTime?: number;
}

export interface Tool extends Item {
	toolType: string;

	// Enhanced tool features
	proficiencyGranted?: string; // What proficiency this tool provides
	abilityBonus?: {
		ability: keyof Stats;
		bonus: number;
		situational?: string; // When this bonus applies
	};

	// Special tool properties
	artisanTool?: boolean;
	musicalInstrument?: boolean;
	gamingSet?: boolean;
}

// Container for items like bags of holding
export interface Container extends Item {
	capacity: number; // Weight capacity
	itemCapacity?: number; // Number of items
	weightReduction?: number; // Weight reduction factor
	containedItems?: Set<Item>;

	// Special container properties
	extradimensional?: boolean;
	retrievalTime?: "action" | "bonus" | "free";
}

// Wondrous items and miscellaneous magic items
export interface WondrousItem extends Item {
	itemType: "wondrous" | "ring" | "rod" | "staff" | "wand" | "miscellaneous";

	// Active abilities
	abilities?: Array<{
		name: string;
		description: string;
		uses?: number;
		resetType?: "shortRest" | "longRest" | "dawn" | "other";
		activationType: "action" | "bonus" | "reaction" | "passive";
	}>;
}

// Union type for all item types
export type ItemType = Weapon | Armor | Shield | Consumable | Tool | Container | WondrousItem;


// Helper function to determine item type
export function getItemType(item: Item): string {
	if ("damage" in item) return "weapon";
	if ("armorClass" in item && "type" in item && item.type !== "shield") return "armor";
	if ("acBonus" in item) return "shield";
	if ("uses" in item && "effect" in item) return "consumable";
	if ("toolType" in item) return "tool";
	if ("capacity" in item) return "container";
	if ("abilities" in item && (item as any).abilities) return "wondrous";
	return "item";
}

export const itemRarity = {
	None: "None",
	Common: "Common",
	Uncommon: "Uncommon",
	Rare: "Rare",
	VeryRare: "Very Rare",
	Legendary: "Legendary",
	Artifact: "Artifact",
} as const;

export type itemRarity = (typeof itemRarity)[keyof typeof itemRarity];