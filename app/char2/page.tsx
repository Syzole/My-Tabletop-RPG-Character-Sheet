"use client";

import DnDCharacter from "@/lib/DnDCharacter";

import Gandalf from "../../characters/Gandalf.json";
import DnDCharacterStatsSheet from '@/lib/Assets//Dnd 1.0 Sheet/DnDCharacterStatsSheet';



const char = new DnDCharacter();
const char2 = new DnDCharacter();


Object.assign(char2, Gandalf);

export default function Page() {
    return (
        <div>
            <DnDCharacterStatsSheet defaultCharacter={ char2 } />
        </div>
    );
}







