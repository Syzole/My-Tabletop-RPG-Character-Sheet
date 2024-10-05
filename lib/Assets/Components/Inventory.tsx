"use client";

import { useState, useCallback } from "react";
import { Item } from "../../../lib/types";
import ItemCard from "./ItemCard";
import "../../Assets/Dnd 1.0 Sheet/dndstyles.css";
import DnDCharacter from "@/lib/DnDCharacter";
import { convertItemToArmor, convertItemToWeapon, copyCharacter } from "@/lib/utils";
import InventoryBox from "./InventoryManager";


export default function Inventory({ charecter, updateCharacter, setFocusItem }:
    {
        charecter?: DnDCharacter,
        updateCharacter: (field: string, value: any) => void,
        setFocusItem: (value: any) => void
    }) {
    const [ inventoryWindowOpen, setInventoryWindowOpen ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const filteredInventory = charecter?.inventory.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())) || [];

    if (!filteredInventory) return <div>No inventory found.</div>;

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

    const handleEquipWeapon = useCallback((item: Item) => {
        if (charecter) {
            const weapon = convertItemToWeapon(item);
            if (weapon) {
                charecter.handleEquipWeapon(weapon);
                const newCharacter = copyCharacter(charecter);
                updateCharacter("equippedWeapons", newCharacter.equippedWeapons);
            } else {
                alert("Could not equip weapon.");
            }
        }
    }, [ charecter, updateCharacter ]);

    // Function to handle increasing item quantity
    const handleIncreaseQuantity = (index: number) => {
        if (filteredInventory) {
            const updatedInventory = [ ...filteredInventory ];
            updatedInventory[ index ].quantity = (updatedInventory[ index ].quantity || 1) + 1;
            updateCharacter("inventory", updatedInventory);
        }
    };

    // Function to handle decreasing item quantity
    const handleDecreaseQuantity = (index: number) => {
        if (filteredInventory) {
            const updatedInventory = [ ...filteredInventory ];
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
            const updatedInventory = [ ...filteredInventory ];
            updatedInventory[ index ].quantity = quantity;
            updateCharacter("inventory", updatedInventory);
        }

        if (filteredInventory) {
            const updatedInventory = [ ...filteredInventory ];
            updatedInventory[ index ].quantity = quantity;
            updateCharacter("inventory", updatedInventory);
        }
    };

    // Function to remove an item from the inventory
    const handleRemoveItem = (index: number) => {
        if (filteredInventory) {
            const updatedInventory = [ ...filteredInventory ];
            updatedInventory.splice(index, 1);
            updateCharacter("inventory", updatedInventory);
        }
    };

    // Function to handle item selection
    const handleSelectItem = (index: number) => {
        setFocusItem(filteredInventory[ index ]);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold mb-3">Inventory</h2>
                <button
                    className="btn bg-black text-white"
                    onClick={ () => setInventoryWindowOpen(true) }
                >
                    Manage Inventory
                </button>
            </div>
            <div className="d-and-d-character-sheet container-xl mt-5 mb-5 justify-center items-start max-h-[500px] overflow-y-auto h-full">
                {/* Search Input */ }
                <input
                    type="text"
                    placeholder="Search"
                    className="input w-1/2 h-12 p-4 mb-4"
                    value={ searchQuery }
                    onChange={ (e) => setSearchQuery(e.target.value) }
                />

                <div className="flex">
                    <table className="table w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="text-left text-sm font-medium text-gray-900">Item Name</th>
                                <th className="text-left text-sm font-medium text-gray-900">Type</th>
                                <th className="text-left text-sm font-medium text-gray-900">Quantity</th>
                                <th className="text-left text-sm font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { filteredInventory.map((item, index) => (
                                <tr key={ index } className="border-t border-gray-200">
                                    <td className="cursor-pointer underline py-2" onClick={ () => handleSelectItem(index) }>
                                        { item.name }
                                    </td>
                                    <td>{ item.type }</td>
                                    <td className="flex items-center">
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
                                        { item.type === "Weapon" && (
                                            <button
                                                onClick={ (e) => {
                                                    e.stopPropagation();
                                                    handleEquipWeapon(item);
                                                } }
                                                className="btn bg-purple-700 text-white px-4 py-2 w-24 text-center"
                                            >
                                                { charecter?.equippedWeapons.find((weapon) => weapon.name === item.name) ? "Unequip" : "Equip" }
                                            </button>
                                        ) }
                                    </td>
                                </tr>
                            )) }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Inventory Management Modal */ }
            { inventoryWindowOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50 max-h-full">
                    <InventoryBox charecter={ charecter! } setInventoryWindowOpen={ setInventoryWindowOpen } updateCharacter={ updateCharacter } />
                </div>
            ) }
        </div>
    );
}
