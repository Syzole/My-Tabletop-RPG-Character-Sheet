"use client";

import React from "react";
import {
    Item, Weapon, Armor, Shield, Consumable, Tool, Container, WondrousItem, getItemType
} from "@/types/item";
import useFocusStore from "@/stores/FocusStore";

// Keys to hide from properties list
const keysWeDontWantToDisplay = [ "weaponCategory", "containedItems" ];

// Format property keys nicely
export function formatPropertyKey(key: string): string {
    if (key === "ac") return "AC";
    if (key === "dmg1") return "Damage";
    if (key === "dmg2") return "Damage (2 handed)";
    return key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase());
}



const ItemCard: React.FC = () => {
    const { focusItem, focusKey } = useFocusStore();
    const item = focusItem as Item | null;

    const itemType = getItemType(item!);

    // Type guards
    const isWeapon = (item: Item): item is Weapon => itemType === "weapon";
    const isArmor = (item: Item): item is Armor => itemType === "armor";
    const isShield = (item: Item): item is Shield => itemType === "shield";
    const isConsumable = (item: Item): item is Consumable => itemType === "consumable";
    const isTool = (item: Item): item is Tool => itemType === "tool";
    const isContainer = (item: Item): item is Container => itemType === "container";
    const isWondrous = (item: Item): item is WondrousItem => itemType === "wondrous";
    const isItem = (item: any): item is Item => !isWeapon(item) && !isArmor(item) && !isShield(item) && !isConsumable(item) && !isTool(item) && !isContainer(item) && !isWondrous(item);

    if (!item) return (
        <div className="w-64 bg-base-100 p-4 rounded-lg shadow-lg z-10">
            <p className="text-base-content">No item selected.</p>
        </div>
    );

    const renderProperties = () => {
        const props: Record<string, any> = { ...item.statModifiers, ...(item as any).properties, ...(item.limitedUse || {}) };
        //const filteredKeys = focusItem ? Object.keys(props).filter(key => !keysWeDontWantToDisplay.includes(key)) : [];
        let filteredKeys: string[] = [];
        //if it is a weapon, add the properties to the filteredKeys
        if (isWeapon(item)) {
            //spread the set of properties into the filteredKeys
            filteredKeys.push(...Array.from(item.properties || []));
        }

        //make sure filteredKeys does not contain any keys from keysWeDontWantToDisplay
        filteredKeys = filteredKeys.filter(key => !keysWeDontWantToDisplay.includes(key));

        if (filteredKeys.length === 0) return;

        return (
            <div className="text-sm text-base-content/70 mt-2">
                <h4 className="font-bold mb-1">Properties</h4>
                <ul className="flex flex-wrap gap-2">
                    { filteredKeys.map(key => (
                        <li
                            key={ key }
                            className="badge badge-outline badge-sm px-2 py-1"
                        >
                            { formatPropertyKey(key) }
                        </li>
                    )) }
                </ul>
            </div>
        );
    };

    const renderCharges = () => {
        const charges = item.limitedUse?.maxUses ?? item.chargesUsed;
        const chargesUsed = item.limitedUse?.chargesUsed ?? 0;
        if (!charges) return null;

        return (
            <div className="text-sm text-base-content mt-2">
                <strong>Charges:</strong> { chargesUsed } / { charges }
            </div>
        );
    };

    return (
        <div className="w-auto h-auto bg-base-100 p-4 rounded-lg shadow-lg z-10">
            <h3 className="text-lg font-semibold">{ focusKey ?? "Item" }</h3>
            { item.source && item.source.length > 0 && (
                <p className="text-sm text-base-content">
                    <strong>Source:</strong> { item.source.join(", ") }
                </p>
            ) }
            <p className="text-sm text-base-content">
                <strong>Type:</strong> { formatPropertyKey(getItemType(item)) }
            </p>
            { item.value !== undefined && <p className="text-sm text-base-content"><strong>Value:</strong> { item.value } gp</p> }
            { item.weight !== undefined && <p className="text-sm text-base-content"><strong>Weight:</strong> { item.weight } lbs</p> }

            { renderCharges() }

            {/* Conditional rendering depending on item type */ }
            { isWeapon(item) && (
                <div className="text-sm text-base-content mt-2">
                    <p><strong>Weapon Type:</strong> { formatPropertyKey(item.weaponType) }</p>
                    <p><strong>Category:</strong> { formatPropertyKey(item.category) }</p>
                    <p><strong>Damage:</strong> { item.damage.diceCount }d{ item.damage.diceValue } { formatPropertyKey(item.damage.type) }</p>
                    { item.attackBonus && <p><strong>Attack Bonus:</strong> +{ item.attackBonus }</p> }
                    { item.attackType && <p><strong>Attack Type:</strong> { formatPropertyKey(item.attackType) }</p> }
                    { item.range && <p><strong>Range:</strong> { item.range.normal }{ item.range.long ? ` / ${item.range.long}` : "" } ft</p> }
                </div>
            ) }

            { isArmor(item) && (
                <div className="text-sm text-base-content mt-2">
                    <p><strong>AC:</strong> { item.armorClass }</p>
                    <p><strong>Armor Type:</strong> { formatPropertyKey(item.type) }</p>
                    { item.stealthDisadvantage && <p><strong>Stealth Disadvantage</strong></p> }
                    { item.maxDexBonus && <p><strong>Max Dex Bonus:</strong> { item.maxDexBonus }</p> }
                </div>
            ) }

            { isShield(item) && (
                <div className="text-sm text-base-content mt-2">
                    <p><strong>AC Bonus:</strong> { item.acBonus }</p>
                    { item.magicalBonus && <p><strong>Magical Bonus:</strong> +{ item.magicalBonus }</p> }
                </div>
            ) }

            { isConsumable(item) && (
                <div className="text-sm text-base-content mt-2">
                    <p><strong>Effect:</strong> { item.effect }</p>
                    <p><strong>Uses:</strong> { item.uses } / { item.maxUses }</p>
                </div>
            ) }

            { isTool(item) && (
                <div className="text-sm text-base-content mt-2">
                    <p><strong>Tool Type:</strong> { formatPropertyKey(item.toolType) }</p>
                    { item.proficiencyGranted && <p><strong>Proficiency Granted:</strong> { item.proficiencyGranted }</p> }
                </div>
            ) }

            { isContainer(item) && (
                <div className="text-sm text-base-content mt-2">
                    <p><strong>Capacity:</strong> { item.capacity } lbs</p>
                    { item.itemCapacity && <p><strong>Item Capacity:</strong> { item.itemCapacity }</p> }
                </div>
            ) }

            { isWondrous(item) && item.abilities && (
                <div className="text-sm text-base-content mt-2">
                    <h4 className="text-primary font-semibold">Abilities</h4>
                    <ul>
                        { item.abilities.map((ability, i) => (
                            <li key={ i }>
                                <strong>{ ability.name }</strong>: { ability.description } ({ ability.activationType })
                            </li>
                        )) }
                    </ul>
                </div>
            ) }

            { isItem(item) && item.description && item.description.length > 0 && (
                <div className="text-sm text-base-content mt-2">
                    <h4 className="text-primary font-semibold">Description</h4>
                    <p>{ item.description }</p>
                </div>
            ) }

            { renderProperties() }
        </div>
    );
};

export default ItemCard;
