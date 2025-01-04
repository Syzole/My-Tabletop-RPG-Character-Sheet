"use client";

import rougeStartData from "@/characters/class/rogue.json";
import DnDCharacter from "@/lib/DnDCharacter";
import John from "../characters/Beta.json";
import { useState } from "react";
import { classSkeleton } from "@/lib/types";

let mapOfClases = new Map<string, classSkeleton>();

mapOfClases.set(`${rougeStartData.name},${rougeStartData.version}`, { ...rougeStartData, hitDie: rougeStartData.hitDice } as classSkeleton);

console.log(mapOfClases);

export default function Page() {
	const [ classSelected, setClassSelected ] = useState("");
	const [ classData, setClassData ] = useState<classSkeleton | undefined>();

	return (
		<div>
			<h2>Select A class</h2>
			<select
				value={ classSelected }
				onChange={ (e) => {
					const selectedKey = e.target.value;
					const selectedClass = mapOfClases.get(selectedKey);

					setClassSelected(selectedKey);
					setClassData(selectedClass);

					console.log(selectedKey);
					console.log(selectedClass);
				} }
			>
				<option value="">Select a class</option>
				{ Array.from(mapOfClases.entries()).map(([ key, value ]) => (
					<option key={ key } value={ key }>
						{ value.name }
					</option>
				)) }
			</select>
		</div>
	);
}
