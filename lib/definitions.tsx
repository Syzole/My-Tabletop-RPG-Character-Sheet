export const proficienciesByLevel = new Map([
	[ 1, 2 ],
	[ 2, 2 ],
	[ 3, 2 ],
	[ 4, 2 ],
	[ 5, 3 ],
	[ 6, 3 ],
	[ 7, 3 ],
	[ 8, 3 ],
	[ 9, 4 ],
	[ 10, 4 ],
	[ 11, 4 ],
	[ 12, 4 ],
	[ 13, 5 ],
	[ 14, 5 ],
	[ 15, 5 ],
	[ 16, 5 ],
	[ 17, 6 ],
	[ 18, 6 ],
	[ 19, 6 ],
	[ 20, 6 ],
]);

export const simpleMelee = [ "Club", "Dagger", "Greatclub", "Handaxe", "Javelin", "Light Hammer", "Mace", "Quarterstaff", "Sickle", "Spear" ];

export const simpleRanged = [ "Light Crossbow", "Dart", "Shortbow", "Sling" ];

export const simpleWeapons = [ ...simpleMelee, ...simpleRanged ];

export const martialMelee = [
	"Battleaxe",
	"Flail",
	"Glaive",
	"Greataxe",
	"Greatsword",
	"Halberd",
	"Lance",
	"Longsword",
	"Maul",
	"Morningstar",
	"Pike",
	"Rapier",
	"Scimitar",
	"Shortsword",
	"Trident",
	"War Pick",
	"Warhammer",
	"Whip",
];

export const martialRanged = [ "Blowgun", "Hand Crossbow", "Heavy Crossbow", "Longbow", "Net" ];

export const martialWeapons = [ ...martialMelee, ...martialRanged ];

export const allWeapons = [ ...simpleWeapons, ...martialWeapons ];

export const spellSlotsPerLevel = [ // Cantrips are class specific
	[ 2, 0, 0, 0, 0, 0, 0, 0, 0 ], // 1st level
	[ 3, 0, 0, 0, 0, 0, 0, 0, 0 ], // 2nd level
	[ 4, 2, 0, 0, 0, 0, 0, 0, 0 ], // 3rd level
	[ 4, 3, 0, 0, 0, 0, 0, 0, 0 ], // 4th level
	[ 4, 3, 2, 0, 0, 0, 0, 0, 0 ], // 5th level
	[ 4, 3, 3, 1, 0, 0, 0, 0, 0 ], // 6th level
	[ 4, 3, 3, 2, 0, 0, 0, 0, 0 ], // 7th level
	[ 4, 3, 3, 3, 1, 0, 0, 0, 0 ], // 8th level
	[ 4, 3, 3, 3, 2, 1, 0, 0, 0 ], // 9th level
	[ 4, 3, 3, 3, 2, 1, 0, 0, 0 ], // 10th level
	[ 4, 3, 3, 3, 2, 1, 1, 0, 0 ], // 11th level
	[ 4, 3, 3, 3, 2, 1, 1, 0, 0 ], // 12th level
	[ 4, 3, 3, 3, 2, 1, 1, 1, 0 ], // 13th level
	[ 4, 3, 3, 3, 2, 1, 1, 1, 0 ], // 14th level
	[ 4, 3, 3, 3, 2, 1, 1, 1, 1 ], // 15th level
	[ 4, 3, 3, 3, 2, 1, 1, 1, 1 ], // 16th level
	[ 4, 3, 3, 3, 2, 1, 1, 1, 1 ], // 17th level
	[ 4, 3, 3, 3, 3, 1, 1, 1, 1 ], // 18th level
	[ 4, 3, 3, 3, 3, 2, 1, 1, 1 ], // 19th level
	[ 4, 3, 3, 3, 3, 2, 2, 1, 1 ], // 20th level
];

export const allSkills = new Map([
	[ "Acrobatics (Dex)", "acrobatics" ],
	[ "Animal Handling (Wis)", "animalHandling" ],
	[ "Arcana (Int)", "arcana" ],
	[ "Athletics (Str)", "athletics" ],
	[ "Deception (Cha)", "deception" ],
	[ "History (Int)", "history" ],
	[ "Insight (Wis)", "insight" ],
	[ "Intimidation (Cha)", "intimidation" ],
	[ "Investigation (Int)", "investigation" ],
	[ "Medicine (Wis)", "medicine" ],
	[ "Nature (Int)", "nature" ],
	[ "Perception (Wis)", "perception" ],
	[ "Performance (Cha)", "performance" ],
	[ "Persuasion (Cha)", "persuasion" ],
	[ "Religion (Int)", "religion" ],
	[ "Sleight Of Hand (Dex)", "sleightOfHand" ],
	[ "Stealth (Dex)", "stealth" ],
	[ "Survival (Wis)", "survival" ],
]);

export const arcaneFocuses = [ "Crystal", "Orb", "Rod", "Staff", "Wand" ];

export const toolProficiencies = [ "Artisan's Tools", "Disguise Kit", "Forgery Kit", "Gaming Set", "Herbalism Kit", "Musical Instrument", "Navigator's Tools", "Poisoner's Kit", "Thieves' Tools" ];

export const classToSpellCastingModifier = new Map([
	[ "Bard", "charisma" ],
	[ "Cleric", "wisdom" ],
	[ "Druid", "wisdom" ],
	[ "Paladin", "charisma" ],
	[ "Ranger", "wisdom" ],
	[ "Sorcerer", "charisma" ],
	[ "Warlock", "charisma" ],
	[ "Wizard", "intelligence" ],
]);

export const subClassToSpellCastingModifier = new Map([
	[ "Eldritch Knight", "intelligence" ],
	[ "Arcane Trickster", "intelligence" ],
]);

export const classToHitDie = new Map([
	[ "Barbarian", 12 ],
	[ "Bard", 8 ],
	[ "Cleric", 8 ],
	[ "Druid", 8 ],
	[ "Fighter", 10 ],
	[ "Monk", 8 ],
	[ "Paladin", 10 ],
	[ "Ranger", 10 ],
	[ "Rogue", 8 ],
	[ "Sorcerer", 6 ],
	[ "Warlock", 8 ],
	[ "Wizard", 6 ],
]);

