"use client";

import { useState, useCallback } from "react";
import { Item } from "../../../lib/types";
import ItemCard from "./ItemCard";
import "../../Assets/Dnd 1.0 Sheet/dndstyles.css";
import DnDCharacter from "@/lib/DnDCharacter";
import { convertItemToArmor } from "@/lib/utils";

export default function Inventory({ charecter, updateCharacter }: { charecter?: DnDCharacter, updateCharacter: (field: string, value: any) => void }) {
    const [ hoveredItem, setHoveredItem ] = useState<Item | null>(null);

    const inventory = charecter?.inventory;

    if (!inventory) return <div>No inventory found.</div>;

    // Memoize the equip/unequip handler using useCallback
    const handleEquipArmor = useCallback(
        (item: Item) => {
            if (charecter) {
                if (charecter.equippedArmor && charecter.equippedArmor.name === item.name) {
                    const newAc = charecter.unequipArmor();
                    updateCharacter("ac", newAc);
                } else {
                    const armor = convertItemToArmor(item);
                    if (armor) {
                        const newAc = charecter.equipArmor(armor);
                        updateCharacter("ac", newAc);
                    } else {
                        alert("Could not equip armor.");
                    }
                }
            }
        },
        [ charecter, updateCharacter ] // Dependencies that could change
    );

    return (
        <div className="d-and-d-character-sheet container-xl mt-5 mb-5 flex flex-col justify-center items-center relative">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Item Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    { inventory.map((item, index) => (
                        <tr
                            key={ index }
                            className="border-t border-gray-200 relative"
                            onMouseEnter={ () => setHoveredItem(item) }
                            onMouseLeave={ () => setHoveredItem(null) }
                        >
                            <td className="pl-4 text-sm text-gray-700 cursor-pointer underline py-2">
                                <ItemCard key={ index } item={ item } />
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">{ item.type }</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{ item.quantity || 1 }</td>
                            <td>
                                { item.type === "Armor" && (
                                    <button
                                        onClick={ (e) => {
                                            e.stopPropagation();
                                            handleEquipArmor(item); // Call the memoized function
                                        } }
                                        className="btn bg-purple-700 text-white px-4 py-2 w-24 text-center"
                                    >
                                        { charecter?.equippedArmor?.name === item.name ? "Unequip" : "Equip" }
                                    </button>
                                ) }
                            </td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    );
}
