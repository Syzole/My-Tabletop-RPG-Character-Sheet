"use client";

import DnDCharacterStatsSheet from "@/components/charSheets/newCharSheet";
import useCharacterStore from "@/stores/CharacterStore";
import { testRogue } from "@/private-assets/mocks/testRogue";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    useCharacterStore.getState().setCharacter(testRogue);
  }, []);
  // if (!useCharacterStore((s) => s.character)) {
  // 	return (
  // 		<div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
  // 			<p className="text-lg opacity-90">No character loaded.</p>
  // 			<Link href="/create" className="btn btn-primary">
  // 				Create a character
  // 			</Link>
  // 		</div>
  // 	);
  // }

  return (
    <div>
      <DnDCharacterStatsSheet />
    </div>
  );
}
