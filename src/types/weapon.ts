export const WeaponProperties = {
  Ammunition: "Ammunition",
  Finesse: "Finesse",
  Heavy: "Heavy",
  Light: "Light",
  Loading: "Loading",
  Range: "Range",
  Reach: "Reach",
  Thrown: "Thrown",
  TwoHanded: "TwoHanded",
  Versatile: "Versatile",
  ImprovisedWeapons: "Improvised Weapon",
  SilveredWeapons: "Silvered Weapon",
  SpecialWeapons: "Special Weapon",
  Nick:"Nick",
  Sap:"Sap"
} as const;

export type WeaponProperties = (typeof WeaponProperties)[keyof typeof WeaponProperties];

export const WeaponCategories = {
  Simple: "simple",
  Martial: "martial",
} as const;

export type WeaponCategories = (typeof WeaponCategories)[keyof typeof WeaponCategories];

export const Weapons = {
	Club: "club",
	Dagger: "dagger",
	Greatclub: "greatclub",
	Handaxe: "handaxe",
	Javelin: "javelin",
	LightHammer: "light hammer",
	Mace: "mace",
	Quarterstaff: "quarterstaff",
	Sickle: "sickle",
	Spear: "spear",
	CrossbowLight: "crossbow, light",
	Dart: "dart",
	Shortbow: "shortbow",
	Sling: "sling",
	Battleaxe: "battleaxe",
	Flail: "flail",
	Glaive: "glaive",
	Greataxe: "greataxe",
	Greatsword: "greatsword",
	Halberd: "halberd",
	Lance: "lance",
	Longsword: "longsword",
	Maul: "maul",
	Morningstar: "morningstar",
	Pike: "pike",
	Rapier: "rapier",
	Scimitar: "scimitar",
	Shortsword: "shortsword",
	Trident: "trident",
	WarPick: "war pick",
	Warhammer: "warhammer",
	Whip: "whip",
	Blowgun: "blowgun",
	CrossbowHand: "crossbow, hand",
	CrossbowHeavy: "crossbow, heavy",
	Longbow: "longbow",
	Net: "net",
  } as const;

  export type WeaponType = (typeof Weapons)[keyof typeof Weapons];



  export type WeaponProficiency = WeaponType | WeaponCategories;

  export const SimpleWeapons = {
	Club: Weapons.Club,
	Dagger: Weapons.Dagger,
	Greatclub: Weapons.Greatclub,
	Handaxe: Weapons.Handaxe,
	Javelin: Weapons.Javelin,
	LightHammer: Weapons.LightHammer,
	Mace: Weapons.Mace,
	Quarterstaff: Weapons.Quarterstaff,
	Sickle: Weapons.Sickle,
	Spear: Weapons.Spear,
	CrossbowLight: Weapons.CrossbowLight,
	Dart: Weapons.Dart,
	Shortbow: Weapons.Shortbow,
	Sling: Weapons.Sling,
  } as const;
  
  export type SimpleWeapon = (typeof SimpleWeapons)[keyof typeof SimpleWeapons];

  export const MartialWeapons = {
	Battleaxe: Weapons.Battleaxe,
	Flail: Weapons.Flail,
	Glaive: Weapons.Glaive,
	Greataxe: Weapons.Greataxe,
	Greatsword: Weapons.Greatsword,
	Halberd: Weapons.Halberd,
	Lance: Weapons.Lance,
	Longsword: Weapons.Longsword,
	Maul: Weapons.Maul,
	Morningstar: Weapons.Morningstar,
	Pike: Weapons.Pike,
	Rapier: Weapons.Rapier,
	Scimitar: Weapons.Scimitar,
	Shortsword: Weapons.Shortsword,
	Trident: Weapons.Trident,
	WarPick: Weapons.WarPick,
	Warhammer: Weapons.Warhammer,
	Whip: Weapons.Whip,
	Blowgun: Weapons.Blowgun,
	CrossbowHand: Weapons.CrossbowHand,
	CrossbowHeavy: Weapons.CrossbowHeavy,
	Longbow: Weapons.Longbow,
	Net: Weapons.Net,
  } as const;

  export type MartialWeapon = (typeof MartialWeapons)[keyof typeof MartialWeapons];