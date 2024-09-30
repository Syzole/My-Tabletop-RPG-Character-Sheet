"use client";

import DnDCharacter from "@/lib/DnDCharacter";
import { useEffect, useState, useRef } from "react";
import { Item } from "@/lib/types";
import InventoryItemCard from "./InventoryItemCard"; // Import the new InventoryItemCard

export default function InventoryBox({
    charecter,
    setInventoryWindowOpen,
    updateCharacter,
}: {
    charecter: DnDCharacter;
    setInventoryWindowOpen: (open: boolean) => void;
    updateCharacter: (field: string, value: any) => void;
}) {
    // State to keep track of the inventory
    const [ inventory, setInventory ] = useState<Item[]>(charecter.inventory);
    const [ databaseItems, setDatabaseItems ] = useState<Item[]>([]);
    const [ hoveredItem, setHoveredItem ] = useState<Item | null>(null);
    const fetchCalled = useRef(false);
    const inventoryBoxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/items", {
                    method: "GET",
                });
                if (response.ok) {
                    const data = await response.json();
                    const items = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
                    return items as Item[];
                } else {
                    console.error("Error fetching items:", response.statusText);
                    return [];
                }
            } catch (error) {
                console.error("Error fetching items:", error);
                return [];
            }
        };

        if (!fetchCalled.current) {
            let items = fetchItems();
            fetchCalled.current = true;
            items.then((items) => {
                setDatabaseItems(items);
            });
        }
    }, []);

    // Event listener for clicks outside the inventory box
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (inventoryBoxRef.current && !inventoryBoxRef.current.contains(event.target as Node)) {
                setInventoryWindowOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ setInventoryWindowOpen ]);

    // Function to add an item to the character's inventory
    const addItemToInventory = (item: Item) => {
        const newInventory = [ ...inventory, item ];
        setInventory(newInventory);
        updateCharacter("inventory", newInventory); // Call the updateCharacter function to update the inventory in the character object
    };

    return (
        <div ref={ inventoryBoxRef } className="bg-white p-8 rounded-lg shadow-lg relative flex">
            <div className="flex-1">
                <h2 className="text-2xl mb-4">Inventory Management</h2>
                <button
                    className="absolute top-2 right-2 text-black"
                    onClick={ () => setInventoryWindowOpen(false) }
                >
                    Close
                </button>

                {/* Render the inventory items here */ }
                <div
                    className="overflow-y-auto"
                    style={ { maxHeight: "300px", border: "1px solid #e2e8f0", padding: "10px" } }
                >
                    { Array.isArray(databaseItems) ? (
                        databaseItems.map((item) => (
                            <InventoryItemCard
                                key={ item.name }
                                item={ item }
                                onAddItem={ () => addItemToInventory(item) }
                                onMouseEnter={ () => setHoveredItem(item) } // Set hovered item on mouse enter
                                onMouseLeave={ () => setHoveredItem(null) } // Remove hovered item on mouse leave
                            />
                        ))
                    ) : (
                        <p>Loading...</p>
                    ) }
                </div>
            </div>

            {/* ItemCard display when hovering over an item */ }
            { hoveredItem && (
                <div
                    className="absolute top-0 ml-4 p-6 bg-white border rounded-lg shadow-2xl z-20"
                    style={ {
                        left: "100%", // Position it to the right of the InventoryBox
                        transform: "translateX(20px)", // Give some extra space between inventory box and hover card
                        width: "400px", // Make it large for visibility
                        height: "400px", // Increase maxHeight for better display
                        overflowY: "auto", // Scroll if the content exceeds height
                        fontSize: "1.1rem", // Larger font size for visibility
                    } }
                >
                    <div className="absolute left-0 mt-2 w-full bg-white p-4 rounded-lg shadow-lg z-10">
                        <h3 className="text-lg font-semibold text-indigo-600">{ hoveredItem.name }</h3>
                        <p className="text-sm text-gray-600">
                            <strong>Source:</strong> { hoveredItem.source.join(", ") }
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Type:</strong> { hoveredItem.type }
                        </p>
                        { hoveredItem.rarity && (
                            <p className="text-sm text-gray-600">
                                <strong>Rarity:</strong> { hoveredItem.rarity }
                            </p>
                        ) }
                        { hoveredItem.value && (
                            <p className="text-sm text-gray-600">
                                <strong>Value:</strong> { hoveredItem.value } gp
                            </p>
                        ) }
                        { hoveredItem.weight && (
                            <p className="text-sm text-gray-600">
                                <strong>Weight:</strong> { hoveredItem.weight } lbs
                            </p>
                        ) }
                        { hoveredItem.properties && (
                            <div className="text-sm text-gray-600 mt-2">
                                <strong>Properties:</strong>
                                <ul className="list-disc list-inside">
                                    { Object.keys(hoveredItem.properties).map((key, index) => (
                                        <li key={ index }>
                                            { key }: { hoveredItem.properties[ key ] }
                                        </li>
                                    )) }
                                </ul>
                            </div>
                        ) }
                    </div>
                </div>
            ) }
        </div>
    );
}
