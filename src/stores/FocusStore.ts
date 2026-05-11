//stores/focusStore.ts

import { create } from "zustand";
import { ItemType } from "@/types/item";
import { Feature } from "@/types/feature";

type FocusStore = {
	focusItem: ItemType | Feature | null;
	focusKey: string | null;
	setFocusItem: (item: ItemType | Feature | null, key?: string | null) => void;
};

const useFocusStore = create<FocusStore>((set) => ({
	focusItem: null,
	focusKey: null,
	setFocusItem: (item, key) =>
		set({ focusItem: item, focusKey: item == null ? null : (key ?? null) }),
}));

export default useFocusStore;
