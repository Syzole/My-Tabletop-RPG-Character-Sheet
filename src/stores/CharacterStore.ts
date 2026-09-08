// stores/characterStore.ts
import { create } from "zustand";
import { Character } from "@/types/character";
import {
  copyUnlockedClassFeatures,
  newlyUnlockedRaceFeatures,
} from "@/constants/featureSources";

type CharacterStore = {
  character: Character | null;
  setCharacter: (character: Character) => void;
  updateCharacterField: (key: keyof Character, value: any) => void;
  /** Level up and clone newly unlocked class/subclass catalog features onto the character. */
  levelUpCharacter: () => string[];
};

const useCharacterStore = create<CharacterStore>((set, get) => ({
  character: null,
  setCharacter: (character) => set({ character }),
  updateCharacterField: (key, value) =>
    set((state) => ({
      character: state.character ? { ...state.character, [key]: value } : null,
    })),
  levelUpCharacter: () => {
    const c = get().character;
    if (!c) return [];
    const nextLevel = c.level + 1;
    const { features, newlyUnlocked: classUnlocked } = copyUnlockedClassFeatures(
      { ...c, level: nextLevel },
      c.features ?? {},
    );
    const raceUnlocked = newlyUnlockedRaceFeatures(c, c.level, nextLevel);
    set({ character: { ...c, level: nextLevel, features } });
    return [...classUnlocked, ...raceUnlocked];
  },
}));

export default useCharacterStore;
