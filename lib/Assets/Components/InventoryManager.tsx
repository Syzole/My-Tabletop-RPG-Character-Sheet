"use client";

import DnDCharacter from "@/lib/DnDCharacter";
import { useEffect, useState, useRef } from "react";
import { Item } from "@/lib/types";
import InventoryItemCard from "./InventoryItemCard"; // Import the new InventoryItemCard
import ItemCard from "./ItemCard";

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
    const [ searchQuery, setSearchQuery ] = useState<string>(''); // State for the search query
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

    // Function to handle the search
    const filteredItems = databaseItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Filter based on item name
    );

    return (
        <div ref={ inventoryBoxRef } className="bg-white p-8 rounded-lg shadow-lg relative flex w-max">
            <div className="flex-1 flex">
                <div className="">
                    <h2 className="text-2xl mb-4">Inventory Management</h2>
                    <button
                        className="absolute top-2 right-2 text-black"
                        onClick={ () => setInventoryWindowOpen(false) }
                    >
                        Close
                    </button>
                    {/* Search bar */ }
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={ searchQuery }
                        onChange={ (e) => setSearchQuery(e.target.value) }
                        className="mb-4 p-2 border rounded w-full"
                    />
                    {/* Render the inventory items here */ }
                    <div
                        className="overflow-y-auto flex-1"
                        style={ { height: "600px", border: "1px solid #e2e8f0", padding: "10px" } }
                    >
                        { Array.isArray(filteredItems) && filteredItems.length > 0 ? (
                            filteredItems.map((item) => (
                                <InventoryItemCard
                                    key={ item.name }
                                    item={ item }
                                    onAddItem={ () => {
                                        item.quantity = 1;
                                        addItemToInventory(item)
                                    } }
                                    onMouseEnter={ () => setHoveredItem(item) } // Set hovered item on mouse enter
                                    onMouseLeave={ () => setHoveredItem(null) } // Remove hovered item on mouse leave
                                />
                            ))
                        ) : (
                            <p>No items found.</p>
                        ) }
                    </div>
                </div>
                {/* ItemCard display when hovering over an item */ }
                { hoveredItem ? (
                    <ItemCard item={ hoveredItem } className="" />
                ) : (
                    <ItemCard />
                ) }
            </div>


        </div>
    );
}
