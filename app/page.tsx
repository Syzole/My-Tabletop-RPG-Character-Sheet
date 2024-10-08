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

let item = {
	name: 'Dagger',
	value: 200,
	weight: 1,
	quantity: 1,
	source: [ 'PHB', '149' ],
	rarity: 'none',
	type: 'Weapon',
	properties: {
		dmg1: '1d4',
		range: '20/60',
		dmgType: 'Piercing',
		property: [ 'Finesse', 'Light', 'Thrown' ],
		rangeType: 'Melee',
		weaponType: 'Dagger',
		weaponCategory: 'simple'
	}
}

let dagger = convertItemToWeapon(item);

//<DnDCharacterStatsSheet character={ char } />

export default function Page() {
	return (
		<div>
			<DnDCharacterStatsSheet character={ char } />
		</div>
	);
}







