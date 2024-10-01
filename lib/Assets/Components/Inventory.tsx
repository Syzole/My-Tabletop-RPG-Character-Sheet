"use client";

import { useState, useCallback } from "react";
import { Item } from "../../../lib/types";
import ItemCard from "./ItemCard";
import "../../Assets/Dnd 1.0 Sheet/dndstyles.css";
import DnDCharacter from "@/lib/DnDCharacter";
import { convertItemToArmor } from "@/lib/utils";

export default function Inventory({ charecter, updateCharacter }: { charecter?: DnDCharacter, updateCharacter: (field: string, value: any) => void }) {
    const [ hoveredItemIndex, setHoveredItemIndex ] = useState<number | null>(null);


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

    // Function to handle increasing item quantity
    const handleIncreaseQuantity = (index: number) => {
        if (inventory) {
            const updatedInventory = [ ...inventory ];
            updatedInventory[ index ].quantity = (updatedInventory[ index ].quantity || 1) + 1;
            updateCharacter("inventory", updatedInventory);
        }
    };

    // Function to handle decreasing item quantity
    const handleDecreaseQuantity = (index: number) => {
        if (inventory) {
            const updatedInventory = [ ...inventory ];
            if (updatedInventory[ index ].quantity && updatedInventory[ index ].quantity > 1) {
                updatedInventory[ index ].quantity -= 1;
                updateCharacter("inventory", updatedInventory);
            }
        }
    };

    // Function to remove an item from the inventory
    const handleRemoveItem = (index: number) => {
        if (inventory) {
            const updatedInventory = [ ...inventory ];
            updatedInventory.splice(index, 1);
            updateCharacter("inventory", updatedInventory);
        }

    };

    const handleChangeQuantity = (index: number, quantity: number) => {
        if (quantity < 1) {
            quantity = 1;
            const updatedInventory = [ ...inventory ];
            updatedInventory[ index ].quantity = quantity;
            updateCharacter("inventory", updatedInventory);
        }

        if (inventory) {
            const updatedInventory = [ ...inventory ];
            updatedInventory[ index ].quantity = quantity;
            updateCharacter("inventory", updatedInventory);
        }
    };

    return (
        <div className="d-and-d-character-sheet container-xl mt-5 mb-5 flex flex-col justify-center items-center relative">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Item Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Quantity</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    { inventory.map((item, index) => (
                        <tr
                            key={ index }
                            className="border-t border-gray-200 relative"
                            onMouseEnter={ () => setHoveredItemIndex(index) }
                            onMouseLeave={ () => setHoveredItemIndex(null) }
                        >
                            <td className="pl-4 text-sm text-gray-700 cursor-pointer underline py-2">
                                { hoveredItemIndex === index ? (
                                    <ItemCard key={ index } item={ item } className="absolute" />
                                ) : (
                                    <span>{ item.name }</span>
                                ) }
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-700">{ item.type }</td>
                            <td className="px-4 py-2 text-sm text-gray-700 flex items-center">
                                <button
                                    onClick={ () => handleDecreaseQuantity(index) }
                                    className="btn bg-gray-300 text-black px-2 py-1 mr-2"
                                    disabled={ item.quantity === 1 }
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={ item.quantity || 1 }
                                    onChange={ (e) => handleChangeQuantity(index, parseInt(e.target.value)) }
                                    className="w-12 text-center"
                                />
                                <button
                                    onClick={ () => handleIncreaseQuantity(index) }
                                    className="btn bg-gray-300 text-black px-2 py-1 ml-2"
                                >
                                    +
                                </button>
                                <button
                                    onClick={ () => handleRemoveItem(index) }
                                    className="btn bg-red-500 text-white px-2 py-1 ml-2"
                                >
                                    Remove
                                </button>
                            </td>
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
