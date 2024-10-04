"use client";

import { useState, useCallback } from "react";
import { Item } from "../../../lib/types";
import ItemCard from "./ItemCard";
import "../../Assets/Dnd 1.0 Sheet/dndstyles.css";
import DnDCharacter from "@/lib/DnDCharacter";
import { convertItemToArmor } from "@/lib/utils";

export default function Inventory({ charecter, updateCharacter, setFocusItem }:
    {
        charecter?: DnDCharacter,
        updateCharacter: (field: string, value: any) => void,
        setFocusItem: (value: any) => void
    }) {
    const [ selectedItemIndex, setSelectedItemIndex ] = useState<number | null>(null);

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
        [ charecter, updateCharacter ]
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

    // Function to handle changing item quantity
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

    // Function to remove an item from the inventory
    const handleRemoveItem = (index: number) => {
        if (inventory) {
            const updatedInventory = [ ...inventory ];
            updatedInventory.splice(index, 1);
            updateCharacter("inventory", updatedInventory);
        }
    };

    // Function to handle item selection
    const handleSelectItem = (index: number) => {
        setFocusItem(inventory[ index ]);
    };

    return (
        <div className="d-and-d-character-sheet container-xl mt-5 mb-5 flex justify-center items-start max-h-[450px] overflow-y-auto h-full">
            {/* Inventory Table */ }
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
                            className="border-t border-gray-200"
                        >
                            <td
                                className="pl-4 text-sm text-gray-700 cursor-pointer underline py-2"
                                onClick={ () => handleSelectItem(index) }
                            >
                                { item.name }
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
                                            handleEquipArmor(item);
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

            {/* ItemCard Display on Right Side */ }
            { selectedItemIndex !== null && inventory[ selectedItemIndex ] && (
                <div className="ml-4 mt-2 w-80 absolute right-0 top-0 bg-white p-4 rounded-lg shadow-lg">
                    <ItemCard item={ inventory[ selectedItemIndex ] } />
                </div>
            ) }
        </div>
    );
}
