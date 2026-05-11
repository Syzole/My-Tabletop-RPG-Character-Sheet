import { Character } from "@/types/character";
import { Item, Weapon } from "@/types/item";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Feature } from "@/types/feature";
import { calculateAttackBonus } from "@/utils/character";
import { capitalizeFirstLetter, formatPropertyKey } from "@/utils/text";
import useCharacterStore from "@/stores/CharacterStore";
import useFocusStore from "@/stores/FocusStore";
import { featureType } from "@/types/feature";
import { CharacterSpellEntry } from "@/types/spellcasting";
import { castingTimeType, Spell } from "@/types/spell";
import { calculateSpellAttackBonus, calculateSpellSaveDC } from "@/utils/spell";
import { statName } from "@/types/stats";
import { getAllFeatures } from "@/utils/feature";
import { getUnlockedFeaturesByLevel } from "@/utils/featureUnlocks";

const tabs = [ "All", "Attack", "Action", "Bonus Action", "Reaction", "Other" ];


export default function ActionBox({ classname }: { classname?: string }) {

    const { character } = useCharacterStore();

    const [ activeTab, setActiveTab ] = useState<string>("All");
    const [ filteredArray, setFilteredArray ] = useState<Array<[ string, Feature | Weapon | CharacterSpellEntry ]>>([]);

    if (!character) {
        return <></>;
    }

    // Memoize action arrays to avoid recalculating on every render
    //const attackArray = character.equipment?.filter((item) => (item.equipped && isWeapon(item))) || [];

    const unlockedFeatures = useMemo(
        () => getUnlockedFeaturesByLevel(getAllFeatures(character), character.level),
        [ character ],
    );

    const actionMap = useMemo(() => {
        const map = new Map<string, Feature>();
        Object.entries(unlockedFeatures).forEach(([ name, feature ]) => {
            if (feature.type === featureType.Action) {
                map.set(name, feature);
            }
        });
        return map;
    }, [ unlockedFeatures ]);

    const bonusActionMap = useMemo(() => {
        const map = new Map<string, Feature>();
        Object.entries(unlockedFeatures).forEach(([ name, feature ]) => {
            if (feature.type === featureType.BonusAction) {
                map.set(name, feature);
            }
        });
        return map;
    }, [ unlockedFeatures ]);

    const reactionMap = useMemo(() => {
        const map = new Map<string, Feature>();
        Object.entries(unlockedFeatures).forEach(([ name, feature ]) => {
            if (feature.type === featureType.Reaction) {
                map.set(name, feature);
            }
        });
        return map;
    }, [ unlockedFeatures ]);

    const otherMap = useMemo(() => {
        const map = new Map<string, Feature>();
        Object.entries(unlockedFeatures).forEach(([ name, feature ]) => {
            if (feature.type === featureType.Other) {
                map.set(name, feature);
            }
        });
        return map;
    }, [ unlockedFeatures ]);

    const weaponMap = useMemo(() => {
        const map = new Map<string, Weapon>();
        Object.entries(character.equipment ?? {}).forEach(([ name, item ]) => {
            if (item.equipped === true && isWeapon(item)) {
                map.set(name, item);
            }
        });
        return map;
    }, [ character.equipment ]);

    const spellMap = useMemo(() => {
        const map = new Map<string, CharacterSpellEntry>();
        Object.entries(character.spellcasting?.spells ?? {}).forEach(([ name, entry ]) => {
            map.set(name, entry);
        });
        return map;
    }, [ character.spellcasting?.spells ]);

    const actionSpellMap = useMemo(() => {
        const map = new Map<string, CharacterSpellEntry>();
        spellMap.forEach((entry, name) => {
            if (entry.spell.castingTime.type === castingTimeType.Action) {
                map.set(name, entry);
            }
        });
        return map;
    }, [ spellMap ]);

    const bonusActionSpellMap = useMemo(() => {
        const map = new Map<string, CharacterSpellEntry>();
        spellMap.forEach((entry, name) => {
            if (entry.spell.castingTime.type === castingTimeType.BonusAction) {
                map.set(name, entry);
            }
        });
        return map;
    }, [ spellMap ]);

    const reactionSpellMap = useMemo(() => {
        const map = new Map<string, CharacterSpellEntry>();
        spellMap.forEach((entry, name) => {
            if (entry.spell.castingTime.type === castingTimeType.Reaction) {
                map.set(name, entry);
            }
        });
        return map;
    }, [ spellMap ]);

    const otherSpellMap = useMemo(() => {
        const map = new Map<string, CharacterSpellEntry>();
        spellMap.forEach((entry, name) => {
            if (
                entry.spell.castingTime.type !== castingTimeType.Action &&
                entry.spell.castingTime.type !== castingTimeType.BonusAction &&
                entry.spell.castingTime.type !== castingTimeType.Reaction
            ) {
                map.set(name, entry);
            }
        });
        return map;
    }, [ spellMap ]);

    // Memoize filterTotalArray function to prevent unnecessary re-renders
    const filterTotalArray = useCallback((type: string) => {
        const filterMap: Record<string, Array<[ string, Feature | Weapon | CharacterSpellEntry ]>> = {
            "All": [
                ...Array.from(weaponMap.entries()),
                ...Array.from(actionMap.entries()),
                ...Array.from(bonusActionMap.entries()),
                ...Array.from(reactionMap.entries()),
                ...Array.from(otherMap.entries()),
                ...Array.from(spellMap.entries())
            ],
            "Attack": Array.from(weaponMap.entries()),
            "Action": [
                ...Array.from(actionMap.entries()),
                ...Array.from(weaponMap.entries()),
                ...Array.from(actionSpellMap.entries())
            ],
            "Bonus Action": [
                ...Array.from(bonusActionMap.entries()),
                ...Array.from(bonusActionSpellMap.entries())
            ],
            "Reaction": [
                ...Array.from(reactionMap.entries()),
                ...Array.from(reactionSpellMap.entries())
            ],
            "Other": [
                ...Array.from(otherMap.entries()),
                ...Array.from(otherSpellMap.entries())
            ],
        };
        setFilteredArray(filterMap[ type ] || []);
    }, [ weaponMap, actionMap, bonusActionMap, reactionMap, otherMap, spellMap, actionSpellMap, bonusActionSpellMap, reactionSpellMap, otherSpellMap ]);

    // Memoize filtered array to only recalculate when activeTab or relevant maps change
    useEffect(() => {
        filterTotalArray(activeTab);
    }, [ activeTab, actionMap, bonusActionMap, reactionMap, otherMap, weaponMap, filterTotalArray ]);


    //console.log("Attack Array:", attackArray);

    return (
        <div
            className={ `action-box ${classname || ""}` }
        >
            <div className="tabs mb-5 tabs-box justify-between w-full ">
                { tabs.map((tab) => (
                    <a
                        key={ tab }
                        className={ `
                        tab px-6 py-3 transition-all duration-300 ease-in-out grow text-center
                        ${activeTab === tab ? "tab-active" : "opacity-60"}
                        `}
                        onClick={ () => setActiveTab(tab) }
                    >
                        { tab }
                    </a>
                )) }
            </div>
            <div className="h-full">
                <table className="table table-fixed w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 w-2/6">Attack</th>
                            <th className="px-4 py-2 w-1/6">Range</th>
                            <th className="px-4 py-2 w-1/6">Hit/DC</th>
                            <th className="px-4 py-2 w-1/6">Damage/Type</th>
                            <th className="px-4 py-2 w-1/6">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        { filteredArray.map(([ name, item ], index) => (
                            <ActionTableRow key={ index } name={ name } target={ item } character={ character } />
                        )) }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function isWeapon(item: any): item is Weapon {
    return item && typeof item === "object" && "damage" in item && "weaponType" in item;
}

function isFeature(item: any): item is Feature {
    return typeof item === "object" && item !== null && "type" in item && !("weaponType" in item);
}

function isSpellEntry(item: any): item is CharacterSpellEntry {
    return typeof item === "object" && item !== null && "spell" in item && "ability" in item;
}

function formatSpellRange(spell: Spell): string {
    const { distance } = spell.range;
    switch (distance.type) {
        case "feet":
            return distance.amount != null ? `${distance.amount} ft` : "ft";
        case "touch":
            return "Touch";
        case "self":
            return "Self";
        case "sight":
            return "Sight";
        case "unlimited":
            return "Unlimited";
        case "miles":
            return distance.amount != null ? `${distance.amount} mi` : "miles";
        case "custom":
            return "Special";
        default:
            return capitalizeFirstLetter(distance.type);
    }
}

function formatSaveAbility(saveAbility: statName): string {
    const saveAbilities: Record<statName, string> = {
        [statName.Strength]: "STR",
        [statName.Dexterity]: "DEX",
        [statName.Constitution]: "CON",
        [statName.Intelligence]: "INT",
        [statName.Wisdom]: "WIS",
        [statName.Charisma]: "CHA",
    };
    return saveAbilities[ saveAbility ];
}

function formatSpellHitOrDC(spellName: string, spell: Spell): string {
    if (spell.isAttackRoll === "ranged" || spell.isAttackRoll === "melee") {
        const bonus = calculateSpellAttackBonus(spellName);
        return bonus > 0 ? `+${bonus}` : bonus.toString();
    }
    if (spell.saveAbility) {
        return `${formatSaveAbility(spell.saveAbility)} ${calculateSpellSaveDC(spellName)}`;
    }
    return "—";
}

function formatSpellEffect(spell: Spell): string {
    if (!spell.damage) return "—";
    const typeText = spell.damage.type ? ` ${capitalizeFirstLetter(spell.damage.type)}` : "";
    return `${spell.damage.diceCount}d${spell.damage.diceValue}${typeText}`;
}


function ActionTableRow({ name, target, character }: { name: string; target: Weapon | Feature | CharacterSpellEntry; character: Character }) {
    if (!target) return null;

    const { focusItem, setFocusItem } = useFocusStore();

    // Use type narrowing
    if (isWeapon(target)) {
        // TypeScript now knows target is a Weapon
        const bonus = calculateAttackBonus(target, character);
        const hitText = capitalizeFirstLetter(bonus > 0 ? `+${bonus}` : bonus.toString());
        const range = target.range
            ? `${target.range.normal}ft${target.range.long ? `/${target.range.long}ft` : ""}`
            : "5ft";
        const damage = `${target.damage.diceCount}d${target.damage.diceValue}`;
        const damageType = capitalizeFirstLetter(target.damage.type || "—");

        return (
            <tr onClick={ () => setFocusItem(target, name) } className="cursor-pointer">
                <td className="w-2/6">{ name }</td>
                <td className="w-1/6">{ range }</td>
                <td className="w-1/6">{ hitText }</td>
                <td className="w-1/6">{ `${damage} ${capitalizeFirstLetter(damageType)}` }</td>
                <td className="w-1/6">
                    { target.properties
                        ? Array.from(target.properties)
                            .map((prop) => formatPropertyKey(prop))
                            .join(", ")
                        : "" }
                </td>
            </tr>
        );
    }

    // Otherwise it's a Feature
    if (isFeature(target)) {
        return (
            <tr onClick={ () => setFocusItem(target, name) } className="cursor-pointer">
                <td className="w-2/6">{ name }</td>
                <td className="w-1/6">{ target.range ? `${target.range}ft` : "—" }</td>
                <td className="w-1/6">--</td>
                <td className="w-1/6">
                    { target.damage
                        ? `${target.damage.diceCount}d${target.damage.diceValue}${target.damage.type ? ` ${capitalizeFirstLetter(target.damage.type)}` : ""
                        }`
                        : "--" }
                </td>
                <td className="w-1/6"></td>
            </tr>
        );
    }

    if (isSpellEntry(target)) {
        return (
            <tr>
                <td className="w-2/6">{ target.spell.name || name }</td>
                <td className="w-1/6">{ formatSpellRange(target.spell) }</td>
                <td className="w-1/6">{ formatSpellHitOrDC(name, target.spell) }</td>
                <td className="w-1/6">{ formatSpellEffect(target.spell) }</td>
                <td className="w-1/6">{ target.spell.components.verbal ? "V" : "" } { target.spell.components.somatic ? "S" : "" } { target.spell.components.material ? "M" : "" }</td>
            </tr>
        );
    }
}
