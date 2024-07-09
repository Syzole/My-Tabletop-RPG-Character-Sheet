import React from "react";
import Link from "next/link";

export default function NavBar() {
	return (
		<nav>
			<ul>
				<li>
					<Link href="/">Home</Link>
				</li>
				<li>
					<Link href="/character-creation">Create Character</Link>
				</li>
				<li>
					<Link href="/character-sheet">Character Sheet</Link>
				</li>
				<li>
					<Link href="/spell-list">Spell List</Link>
				</li>
				<li>
					<Link href="/inventory">Inventory</Link>
				</li>
				<li>
					<Link href="/notes">Campaign Notes</Link>
				</li>
				<li>
					<Link href="/monster-manual">Monster Manual</Link>
				</li>
				<li>
					<Link href="/dice-roller">Dice Roller</Link>
				</li>
			</ul>
		</nav>
	);
};
