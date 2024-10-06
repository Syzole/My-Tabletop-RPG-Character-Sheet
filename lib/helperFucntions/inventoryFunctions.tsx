import DnDCharacter from "../DnDCharacter";
import { Armor, Item, Weapon } from "../types";

export function equipArmor(charecter: DnDCharacter, armor: Armor,): number {
    charecter.equippedArmor = armor;
    charecter.updateAC();
    console.log(`Equipped ${armor.type} armor with base AC ${armor.ac}.`);
    return charecter.ac;
}

export function unequipArmor(charecter: DnDCharacter): number {
    charecter.equippedArmor = undefined;
    charecter.ac = 10 + charecter.getStatModifier("dex");
    console.log(`Armor unequipped. Base AC is now ${charecter.ac}.`);
    return charecter.ac;
}

export function updateAC(charecter: DnDCharacter): number {
    if (charecter.equippedArmor) {
        let dexModifier = charecter.getStatModifier("dex");

        // Enforce maxDex limitation if defined for the armor
        if (charecter.equippedArmor.maxDex !== undefined) {
            dexModifier = Math.min(dexModifier, charecter.equippedArmor.maxDex);
        }

        // Calculate AC: Armor's base AC + Dexterity modifier (with maxDex applied)
        charecter.ac = charecter.equippedArmor.ac + dexModifier;
    } else {
        // No armor equipped, revert to default AC
        charecter.ac = 10 + charecter.getStatModifier("dex");
    }

    console.log(`Updated AC is now ${charecter.ac}.`);

    return charecter.ac;
}

function equipWeapon(charecter: DnDCharacter, weapon: Item) {
    if (charecter.equippedWeapons.includes(weapon)) {
        console.log(`Weapon ${weapon.name} is already equipped.`);
        return;
    }

    charecter.equippedWeapons.push(weapon);
    console.log(`Equipped weapon ${weapon.name}.`);
}

function unequipWeapon(charecter: DnDCharacter, weapon: Item) {
    const index = charecter.equippedWeapons.findIndex(equippedWeapon => equippedWeapon.name === weapon.name);

    if (index === -1) {
        console.log(`Weapon ${weapon.name} is not equipped.`);
        return;
    }

    charecter.equippedWeapons.splice(index, 1);
    console.log(`Unequipped weapon ${weapon.name}.`);
}

export function handleEquipWeapon(charecter: DnDCharacter, weapon: Item) {
    const isEquipped = charecter.equippedWeapons.some(equippedWeapon => equippedWeapon.name === weapon.name);

    if (isEquipped) {
        unequipWeapon(charecter, weapon);
    } else {
        equipWeapon(charecter, weapon);
    }
}
