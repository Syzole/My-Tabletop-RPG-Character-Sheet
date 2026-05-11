/**
 * Canonical language lists used by character creation pickers.
 *
 * 5etools encodes "choose any standard language" as `anyStandard: N`.
 */

export const STANDARD_LANGUAGES = [
	"Common",
	"Dwarvish",
	"Elvish",
	"Giant",
	"Gnomish",
	"Goblin",
	"Halfling",
	"Orc",
] as const;

export const EXOTIC_LANGUAGES = [
	"Abyssal",
	"Celestial",
	"Deep Speech",
	"Draconic",
	"Infernal",
	"Primordial",
	"Sylvan",
	"Undercommon",
] as const;

export const ALL_LANGUAGES = [...STANDARD_LANGUAGES, ...EXOTIC_LANGUAGES] as const;
