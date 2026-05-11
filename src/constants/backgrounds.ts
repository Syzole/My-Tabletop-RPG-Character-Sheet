import type { Item } from "@/types/item";
import { itemRarity } from "@/types/item";

const mkItem = (name: string, quantity = 1): Item => ({
	name,
	quantity,
	rarity: itemRarity.None,
});

export const CUSTOM_BACKGROUND_KEY = "custom";

export const BACKGROUND_DEFINITIONS = {
	acolyte: {
		label: "Acolyte",
		startingEquipment: {
			HolySymbol: mkItem("Holy Symbol"),
			PrayerBook: mkItem("Prayer Book"),
			Incense: mkItem("Sticks of Incense", 5),
			Vestments: mkItem("Vestments"),
		},
	},
	criminal: {
		label: "Criminal",
		startingEquipment: {
			Crowbar: mkItem("Crowbar"),
			DarkCommonClothes: mkItem("Dark Common Clothes"),
			Hood: mkItem("Hood"),
			Pouch: mkItem("Belt Pouch"),
		},
	},
	sage: {
		label: "Sage",
		startingEquipment: {
			InkBottle: mkItem("Bottle of Ink"),
			Quill: mkItem("Quill"),
			Notebook: mkItem("Notebook"),
			SmallKnife: mkItem("Small Knife"),
		},
	},
	soldier: {
		label: "Soldier",
		startingEquipment: {
			Insignia: mkItem("Insignia of Rank"),
			Trophy: mkItem("Trophy from a Fallen Enemy"),
			BoneDice: mkItem("Bone Dice"),
			CommonClothes: mkItem("Common Clothes"),
		},
	},
} as const;

export type PredefinedBackgroundKey = keyof typeof BACKGROUND_DEFINITIONS;
export type BackgroundSelectionKey = PredefinedBackgroundKey | typeof CUSTOM_BACKGROUND_KEY;

export const BACKGROUND_OPTIONS: ReadonlyArray<{
	readonly key: BackgroundSelectionKey;
	readonly label: string;
}> = [
	...Object.entries(BACKGROUND_DEFINITIONS).map(([key, value]) => ({
		key: key as PredefinedBackgroundKey,
		label: value.label,
	})),
	{ key: CUSTOM_BACKGROUND_KEY, label: "Custom" },
];

export function getBackgroundLabel(key: BackgroundSelectionKey): string {
	if (key === CUSTOM_BACKGROUND_KEY) return "Custom";
	return BACKGROUND_DEFINITIONS[key].label;
}

export function getBackgroundStartingEquipment(key: BackgroundSelectionKey): Record<string, Item> {
	if (key === CUSTOM_BACKGROUND_KEY) return {};
	const equipment = BACKGROUND_DEFINITIONS[key].startingEquipment;
	return Object.fromEntries(
		Object.entries(equipment).map(([name, item]) => [name, { ...item }]),
	);
}
