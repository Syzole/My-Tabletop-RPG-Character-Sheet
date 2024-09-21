"use client";

import DnDCharacter from "@/lib/DnDCharacter";
import John from "../../characters/John.json";

import DnDCharacterStatsSheet from '@/lib/Assets//Dnd 1.0 Sheet/DnDCharacterStatsSheet';

const char = new DnDCharacter();

Object.assign(char, John);

export default function Page() {
    return (
        <div>
            <DnDCharacterStatsSheet defaultCharacter={ char } />
        </div>
    );
}