import { MartialWeapons, SimpleWeapons, WeaponCategories, WeaponProficiency } from "@/types/weapon";
import { Character } from "@/types/character";
import { Weapon } from "@/types/item";
import { WeaponProperties } from "@/types/weapon";
import { getModifier } from "@/utils/stats";
import { getModifiers } from "./modifiers";

//TODO: add something to check if they are like a tortle or something that mods ac
export function calculateAC(character: Character): number {
	const armorClass = character.armor && character.armor.equipped ? character.armor.armorClass : 10;
	const dexterityModifier = getModifier(character.baseStats.dexterity);

	//check if there is a max dexterity modifier for the armor
	if (character.armor?.maxDexBonus !== undefined) {
		return Math.min(armorClass + dexterityModifier, armorClass + character.armor.maxDexBonus);
	}

	return armorClass + dexterityModifier;
}

// TODO: add something to check if they are like a swashbuckler or something that modifies initiative
export function calculateInitiative(character: Character): number {
	const dexterityModifier = getModifier(character.baseStats.dexterity);
	return dexterityModifier;
}
//If I did want to make it more optimzied, what I could do 
//instead of adding all simple or all martial
// I check the weapon type and category and check the char
//should be O(1) if done well
export function calculateAttackBonus(weapon: Weapon, character: Character): number {
	let weaponProfs = new Set(character.proficiencies.weapons);
	let dexBonus = getModifier(character.baseStats.dexterity);
	let strBonus = getModifier(character.baseStats.strength);

	// reword proficiencies from martial/simple to weapon types
	if (weaponProfs.has(WeaponCategories.Simple)) {
		// first we remove simple
		weaponProfs.delete(WeaponCategories.Simple);
		// then we add all simple weapons
		Object.values(SimpleWeapons).forEach((w) => weaponProfs.add(w));
	}

	//same for martial
	if (weaponProfs.has(WeaponCategories.Martial)) {
		weaponProfs.delete(WeaponCategories.Martial);
		Object.values(MartialWeapons).forEach((w) => weaponProfs.add(w));
	}

	let bonus = 0;
	if (weaponProfs.has(weapon.weaponType as WeaponProficiency)) {
		bonus += character.proficiencyBonus;
	}

	if (weapon.attackType === "melee") {
		// if its finesse, we can use dex or str
		if (weapon.properties?.has(WeaponProperties.Finesse)) {
			bonus += Math.max(dexBonus, strBonus);
		} else {
			bonus += strBonus;
		}
	}

	if (weapon.attackType === "ranged") { // ranged weapons always use dex
		bonus += dexBonus;
	}

	const modifier = getModifiers(character, {
		type: "attackRoll",
		attackType: weapon.attackType,
	});
	bonus += modifier ?? 0;

	return bonus;
}
