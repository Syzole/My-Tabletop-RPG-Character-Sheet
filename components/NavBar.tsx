import React from "react";
import Link from "next/link";

const spacing = "px-10";

interface NavLinkProps {
	href: string;
	text: string;

}

const NavLink = ({ href, text }: NavLinkProps ) => (
	<li className={`${spacing}`}>
		<Link href={href}>{text}</Link>
	</li>
);

export default function NavBar() {
	return (
		<nav>
			<ul className="flex">
				<NavLink
					href="/"
					text="Home"
				/>
				<NavLink
					href="/character-creation"
					text="Create Character"
				/>
				<NavLink
					href="/character-sheet"
					text="Character Sheet"
				/>
				<NavLink
					href="/spell-list"
					text="Spell List"
				/>
				<NavLink
					href="/inventory"
					text="Inventory"
				/>
				<NavLink
					href="/notes"
					text="Campaign Notes"
				/>
				<NavLink
					href="/monster-manual"
					text="Monster Manual"
				/>
				<NavLink
					href="/dice-roller"
					text="Dice Roller"
				/>
			</ul>
		</nav>
	);
}
