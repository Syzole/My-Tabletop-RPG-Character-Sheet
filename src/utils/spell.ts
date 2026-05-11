import useCharacterStore from "@/stores/CharacterStore";
import { SpellLevel } from "@/types/spell";
import { CharacterSpellcasting } from "@/types/spellcasting";
import { getModifier } from "./stats";



function saveSpellcasting(spellcasting: CharacterSpellcasting) {
    const {updateCharacterField } = useCharacterStore.getState();
    updateCharacterField("spellcasting", spellcasting);
}

/**
 * Cast a spell with spell slots
 * @param spellcasting - The spellcasting of the character
 * @param spellName - The name of the spell to cast
 * @param castLevel - The level of the spell to cast
 * @returns True if the spell was cast successfully, false otherwise
 */
export function castSpell(
    spellcasting: CharacterSpellcasting,
    method: "slots" | "pact",
    spellName: string,
    castLevel: number,
): boolean{
    
    const spellEntry = spellcasting.spells[spellName];

    if (!spellEntry) {
        console.error(`Spell ${spellName} not found`);
        return false;
    }
    
    //auto true if spell is a cantrip
    if (spellEntry.spell.level === SpellLevel.Cantrip) {
        return true; 
    }

    if (method === "pact") {
        const pactSlots = spellcasting.pactSlots;
        if (!pactSlots) {
            console.error(`Spell ${spellName} has no pact slots`);
            return false;
        }
        if (castLevel > pactSlots.slotLevel) {
            console.error(`Spell ${spellName} cannot be cast at pact level ${pactSlots.slotLevel}`);
            return false;
        }
        if (pactSlots.used >= pactSlots.max) {
            console.error(`Spell ${spellName} has no pact slots left`);
            return false;
        }
        pactSlots.used++;
    } else {
        // now check the char has a standard spell slot for the spell
        const spellSlot = spellcasting.leveledSlots?.[ castLevel ];

        //check if the spell slot is available
        if (!spellSlot || spellSlot.used >= spellSlot.max) {
            console.error(`Spell ${spellName} has no spell slots left`);
            return false;
        }

        //now we must CONSUME
        spellSlot.used++;
    }

    //and do the update update
    saveSpellcasting(spellcasting);
    
    return true;
}

/**
 * Restore one leveled spell slot at the given slot level (e.g. short rest recovery UI).
 */
export function restoreLeveledSpellSlot(
	spellcasting: CharacterSpellcasting,
	slotLevel: number,
): boolean {
	const spellSlot = spellcasting.leveledSlots?.[ slotLevel ];
	if (!spellSlot || spellSlot.used <= 0) {
		return false;
	}
	spellSlot.used--;
	saveSpellcasting(spellcasting);
	return true;
}

export function restorePactSpellSlot(spellcasting: CharacterSpellcasting): boolean {
	const pactSlots = spellcasting.pactSlots;
	if (!pactSlots || pactSlots.used <= 0) {
		return false;
	}
	pactSlots.used--;
	saveSpellcasting(spellcasting);
	return true;
}

export function calculateSpellAttackBonus(spellName: string){
    const { character } = useCharacterStore.getState();
    
    if (!character) {
        return 0;
    }

    const spellcasting = character.spellcasting;

    if (!spellcasting) {
        return 0;
    }

    //its pretty simlpe

    //step 1 is get the spell
    const spellEntry = spellcasting.spells[spellName];

    if (!spellEntry) {
        console.error(`Spell ${spellName} not found`);
        return 0;
    }

    //if spell does exist just return the spellcasting ability mod and proficiency bonus
    const mod = getModifier(character.baseStats[spellEntry.ability]) + character.proficiencyBonus;

    return mod;
}

export function calculateSpellSaveDC(spellName: string){
    const { character } = useCharacterStore.getState();
    
    if (!character) {
        return 0;
    }
    const spellcasting = character.spellcasting;
    const spellEntry = spellcasting?.spells[spellName];

    if (!spellEntry) {
        console.error(`Spell ${spellName} not found`);
        return 0;
    }

    //the calc for dc save is 8 + prof bonus + mod of the save ability
    const mod = getModifier(character.baseStats[spellEntry.ability]) + character.proficiencyBonus;
    return 8 + character.proficiencyBonus + mod;
}