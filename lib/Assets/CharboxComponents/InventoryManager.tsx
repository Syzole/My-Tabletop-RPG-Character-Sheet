"use client";

import DnDCharacter from "@/lib/DnDCharacter";
import { useEffect, useState, useRef } from "react";
import { Item } from "@/lib/types";
import InventoryItemCard from "../Components/InventoryItemCard";
import ItemCard from "../Components/ItemCard";

interface InventoryBoxProps {
    charecter: DnDCharacter;
    setInventoryWindowOpen: (open: boolean) => void;
    updateCharacter: (field: string, value: any) => void;
}

export default function InventoryBox({
    charecter,
    setInventoryWindowOpen,
    updateCharacter,
}: InventoryBoxProps) {
    const [ inventory, setInventory ] = useState<{ [ key: string ]: Item }>(charecter.inventory);
    const [ databaseItems, setDatabaseItems ] = useState<Item[]>([]);
    const [ hoveredItem, setHoveredItem ] = useState<Item | null>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const fetchCalled = useRef(false);
    const inventoryBoxRef = useRef<HTMLDivElement | null>(null);

    // Fetch items on component mount
    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch("/api/items", { method: "GET" });
                if (response.ok) {
                    const data = await response.json();
                    const items = JSON.parse(Buffer.from(data, "base64").toString("utf-8")) as Item[];
                    setDatabaseItems(items);
                } else {
                    console.error("Error fetching items:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        if (!fetchCalled.current) {
            fetchItems();
            fetchCalled.current = true;
        }
    }, []);

    // Handle clicks outside the inventory box
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

    // Add item to the character's inventory
    const addItemToInventory = (item: Item) => {
        const updatedInventory = { ...inventory, [ item.name ]: { ...item, quantity: 1 } };
        setInventory(updatedInventory);
        updateCharacter("inventory", updatedInventory);
    };

    // Helper function to check if a query matches any item field
    const itemMatchesQuery = (item: Item, query: string) => {
        const lowerQuery = query.toLowerCase();

        // Convert all fields to strings for comparison
        const fieldsToSearch = [
            item.name.toLowerCase(),
            item.type.toLowerCase(),
            ...(item.source ? item.source.map(src => src.toLowerCase()) : []),
            item.rarity?.toLowerCase() || '',
            item.value?.toString() || '',
            item.weight?.toString() || '',

            // Check the properties object
            ...Object.values(item.properties || {}).map(prop => prop.toString().toLowerCase())
        ];

        // Check if any field includes the search query
        return fieldsToSearch.some(field => field.includes(lowerQuery));
    };

    // Filter items based on the search query (search all relevant fields)
    const filteredItems = databaseItems.filter(item => itemMatchesQuery(item, searchQuery));

    return (
        <div ref={ inventoryBoxRef } className="bg-white p-8 rounded-lg shadow-lg relative flex w-max">
            <div className="flex-1 flex">
                <div>
                    <h2 className="text-2xl mb-4">Inventory Management</h2>
                    <button
                        className="absolute top-2 right-2 text-black"
                        onClick={ () => setInventoryWindowOpen(false) }
                    >
                        Close
                    </button>

                    {/* Search Bar */ }
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={ searchQuery }
                        onChange={ e => setSearchQuery(e.target.value) }
                        className="mb-4 p-2 border rounded w-full"
                    />

                    {/* Inventory Items List */ }
                    <div className="overflow-y-auto flex-1" style={ { height: "600px", border: "1px solid #e2e8f0", padding: "10px" } }>
                        { filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <InventoryItemCard
                                    key={ item.name }
                                    item={ item }
                                    onAddItem={ () => addItemToInventory(item) }
                                    character={ charecter }
                                    onMouseEnter={ () => setHoveredItem(item) }
                                    onMouseLeave={ () => setHoveredItem(null) }
                                />
                            ))
                        ) : (
                            <p>No items found.</p>
                        ) }
                    </div>
                </div>

                {/* Display hovered item details */ }
                { hoveredItem ? (
                    <ItemCard item={ hoveredItem } className="" />
                ) : (
                    <ItemCard />
                ) }
            </div>
        </div>
    );
}
