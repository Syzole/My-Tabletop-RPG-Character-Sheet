"use client";

import Link from "next/link";
import DnDCharacterStatsSheet from "@/components/charSheets/newCharSheet";
import useCharacterStore from "@/stores/CharacterStore";
import { testRogue } from "@/mocks/testRogue";


export default function Page() {
	if (!useCharacterStore((s) => s.character)) {
		return (
			<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
				<p className="text-lg opacity-90">No character loaded.</p>
				<Link href="/create" className="btn btn-primary">
					Create a character
				</Link>
			</div>
		);
	}

	// console.log(useCharacterStore((s) => s.character))
	//set char to test rogue
	// useCharacterStore.getState().setCharacter(testRogue);

	return (
		<div>
			<DnDCharacterStatsSheet />
		</div>
	);
}
