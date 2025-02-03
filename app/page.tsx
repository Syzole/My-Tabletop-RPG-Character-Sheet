"use client";

import rougeStartData from "@/characters/class/rouge.json";
import DnDCharacter from "@/lib/DnDCharacter";
import John from "../characters/Beta.json";
import { classSkeleton } from "@/lib/types";
import ClassSelector from "@/lib/charecterCreator/classSelector";
import DnDCharacterStatsSheet from "@/lib/Assets/Dnd 1.0 Sheet/DnDCharacterStatsSheet";

const char = DnDCharacter.fromJSON(John);

export default function Page() {
	return (
		<div className="min-h-screen min-w-screen ">
			{/* <DnDCharacterStatsSheet character={ char } /> */ }
			{ <ClassSelector /> }

		</div>
	);
}


