"use client";

import DnDCharacter from "@/lib/DnDCharacter";
import John from "../characters/John.json";
import Gandalf from "../characters/Gandalf.json";
import DnDCharacterStatsSheet from '@/lib/Assets//Dnd 1.0 Sheet/DnDCharacterStatsSheet';
import { convertItemToWeapon } from "@/lib/utils";

const char = new DnDCharacter();
const char2 = new DnDCharacter();


Object.assign(char2, Gandalf);
Object.assign(char, John);

//<DnDCharacterStatsSheet character={ char } />

export default function Page() {
	return (
		<div>
			<button onClick={ () => console.log(char.equippedWeapons) }
				className="btn btn-primary"
			>Click me</button>
			<DnDCharacterStatsSheet character={ char } />
		</div>
	);
}







