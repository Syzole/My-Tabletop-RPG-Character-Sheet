// stores/characterStore.ts
import { create } from "zustand";
import { Character } from "@/types/character";
import type { Feature } from "@/types/feature";
import { grantUnlockedFeatures } from "@/utils/featureUnlocks";

type CharacterStore = {
	character: Character | null;
	setCharacter: (character: Character) => void;
	updateCharacterField: (key: keyof Character, value: any) => void;
	levelUpCharacter: (available: Record<string, Feature>) => string[];
};

const useCharacterStore = create<CharacterStore>((set, get) => ({
	character: null,
	setCharacter: (character) => set({ character }),
	updateCharacterField: (key, value) =>
		set((state) => ({
			character: state.character ? { ...state.character, [key]: value } : null,
		})),
	levelUpCharacter: (available) => {
		const c = get().character;
		if (!c) return [];
		const nextLevel = c.level + 1;
		const { features, newlyUnlocked } = grantUnlockedFeatures(c.features ?? {}, available, nextLevel);
		set({ character: { ...c, level: nextLevel, features } });
		return newlyUnlocked;
	},
}));

export default useCharacterStore;
