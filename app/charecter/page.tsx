"use client";

import DnDCharacterStatsSheet from '@/lib/Assets//Dnd 1.0 Sheet/DnDCharacterStatsSheet';
import DnDCharacter from "@/lib/DnDCharacter";
import John from "@/characters/Beta.json";

const char = DnDCharacter.fromJSON(John);


export default function Page() {
    return (
        <div>
            <DnDCharacterStatsSheet character={ char } />
        </div>
    );
}
