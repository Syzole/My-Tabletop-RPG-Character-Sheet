"use client";

import DnDCharacter from "@/lib/DnDCharacter";
import { convertItemToArmor, copyCharacter } from "@/lib/utils";
import { useCallback, useState } from "react";
import { Item } from "../../../lib/types";
import "../../Assets/Dnd 1.0 Sheet/dndstyles.css";
import InventoryBox from "./InventoryManager";

export default function Inventory({ charecter, updateCharacter, setFocusItem }:
    {
        charecter?: DnDCharacter,
        updateCharacter: (field: string, value: any) => void,
        setFocusItem: (value: any) => void
    }) {

    const [ inventoryWindowOpen, setInventoryWindowOpen ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    // Filter inventory based on the search query
    const filteredInventory = Object.values(charecter?.inventory || {})
        .filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleEquipArmor = useCallback((item: Item) => {
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
    }, [ charecter, updateCharacter ]);

    const handleEquipWeapon = useCallback((item: Item) => {
        if (charecter) {
            charecter.handleEquipWeapon(item);
            const newCharacter = copyCharacter(charecter);
            updateCharacter("equippedWeapons", newCharacter.equippedWeapons);
        }
    }, [ charecter, updateCharacter ]);

    const handleIncreaseQuantity = (name: string) => {
        if (filteredInventory) {
            const updatedInventory = { ...charecter?.inventory };
            updatedInventory[ name ].quantity += 1;
            updateCharacter("inventory", updatedInventory);
        }
    };

    const handleDecreaseQuantity = (name: string) => {
        const item = charecter?.inventory?.[ name ];
        if (item && item.quantity > 1) {
            const updatedInventory = { ...charecter!.inventory };
            updatedInventory[ name ].quantity -= 1;
            updateCharacter("inventory", updatedInventory);
        }
    };

    const handleChangeQuantity = (name: string, quantity: number) => {
        if (quantity < 1) quantity = 1;
        const updatedInventory = { ...charecter?.inventory };
        updatedInventory[ name ].quantity = quantity;
        updateCharacter("inventory", updatedInventory);
    };

    const handleRemoveItem = (name: string) => {
        const updatedInventory = { ...charecter?.inventory };
        delete updatedInventory[ name ]; // Delete the item from the inventory object
        updateCharacter("inventory", updatedInventory);
    };

    const handleSelectItem = (name: string) => {
        const selectedItem = charecter?.inventory[ name ];
        setFocusItem(selectedItem);
    };

    const sortByName = (character: DnDCharacter) => {
        console.log("sort by name");

        // Sort and reconstruct the inventory as a new object
        const sortedInventory = Object.fromEntries(
            Object.keys(character.inventory)
                .sort()
                .map((key) => [ key, character.inventory[ key ] ])
        );

        console.log(sortedInventory);
        updateCharacter("inventory", sortedInventory);
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
            <div className="d-and-d-character-sheet container-xl mt-5 mb-5 justify-center items-start max-h-[450px] overflow-y-auto h-full">
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
                                <th className="text-left text-sm font-medium text-gray-900"
                                    onClick={ () => sortByName(charecter!) }
                                >Item Name</th>
                                <th className="text-left text-sm font-medium text-gray-900">Type</th>
                                <th className="text-left text-sm font-medium text-gray-900">Quantity</th>
                                <th className="text-left text-sm font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            { filteredInventory.map((item, index) => (
                                <tr key={ index } className="border-t border-gray-200">
                                    <td className="cursor-pointer underline py-2" onClick={ () => handleSelectItem(item.name) }>
                                        { item.name }
                                    </td>
                                    <td>{ item.type }</td>
                                    <td className="flex items-center">
                                        <button
                                            onClick={ () => handleDecreaseQuantity(item.name) }
                                            className="btn bg-gray-300 text-black px-2 py-1 mr-2"
                                            disabled={ item.quantity === 1 }
                                        >
                                            -
                                        </button>
                                        <textarea
                                            value={ item.quantity ? item.quantity : 1 }
                                            onChange={ (e) => handleChangeQuantity(item.name, parseInt(e.target.value)) }
                                            className="w-12 text-center resize-none overflow-hidden"
                                            rows={ 1 }
                                            style={ { minHeight: 'auto' } }
                                        />
                                        <button
                                            onClick={ () => handleIncreaseQuantity(item.name) }
                                            className="btn bg-gray-300 text-black px-2 py-1 ml-2"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={ () => handleRemoveItem(item.name) }
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
