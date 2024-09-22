"use client";

import DnDCharacter from "@/lib/DnDCharacter";
import John from "../characters/John.json";
import Gandalf from "../characters/Gandalf.json";
import DnDCharacterStatsSheet from '@/lib/Assets//Dnd 1.0 Sheet/DnDCharacterStatsSheet';
import Link from "next/link";


const char = new DnDCharacter();
const char2 = new DnDCharacter();


Object.assign(char2, Gandalf);
Object.assign(char, John);

export default function Page() {
	return (
		<div>
			<DnDCharacterStatsSheet defaultCharacter={ char } />
		</div>
	);
}







