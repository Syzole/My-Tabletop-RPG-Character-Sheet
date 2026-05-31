/** One picker option presented to the player at character creation. */
export interface ChoiceOption {
	id: string;
	label: string;
	apply: string;
}

/**
 * A named group of player-resolved picks. Every species choice lives here:
 * ability bumps, language picks, resistance picks, draconic ancestry, etc.
 *
 *   - `count` is how many distinct options must be picked (default 1).
 *   - `unique` defaults to true: the same option can't be picked twice in a
 *     multi-pick group.
 */
export interface ChoiceGroup {
	id: string;
	name: string;
	count?: number;
	unique?: boolean;
	options: ChoiceOption[];
}
