import {WeaponProficiency } from "@/types/weapon";
import { armorType } from "./armor";

export interface Proficiencies {
	armor: Set<armorType>;
	weapons: Set<WeaponProficiency>;
	tools: Set<string>;
	languages: Set<string>;
}
