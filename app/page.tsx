"use client";

import DnDCharacterStatsSheet from './Assets/Dnd 1.0 Sheet/DnDCharacterStatsSheet';
import DnDCharacterSpellsSheet from './Assets/Dnd 1.0 Sheet/DnDCharacterSpellSheet';
import DnDCharecterInventorySheet from './Assets/Dnd 1.0 Sheet/DnDCharecterInventorySheet';
import { useState } from 'react';
import DnDCharacter from "@/lib/DnDCharacter";
import John from "../characters/John.json"
import { Item } from '@/lib/types';

const char = new DnDCharacter();

Object.assign(char, John);

export default function Page() {
	return (
		<div>
			<DnDCharacterStatsSheet />
			<DnDCharecterInventorySheet inventory={ char.inventory } />
		</div>
	);
}





