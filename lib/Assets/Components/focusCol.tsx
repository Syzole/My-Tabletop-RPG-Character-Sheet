"use client";

import React from "react";
import { Item } from "@/lib/types";
import ItemCard from "./ItemCard";

export default function FocusCol({
    focusItem,
    setFocusItem,
}: {
    focusItem?: any;
    setFocusItem?: (field: string, value: any) => void;
}) {
    // Determine what kind of content to display
    if (!focusItem) {
        return null;
    }

    return (
        <div className="focus-col-container p-4 border-l border-gray-300">
            { isItem(focusItem) ? (
                <div>
                    <button className="btn bg-black text-white" onClick={ () => setFocusItem && setFocusItem("focusItem", null) }>
                        Close
                    </button>
                    <ItemCard item={ focusItem as Item } />
                </div>
            ) : (
                null
            ) }
        </div>
    );
}

// Helper function to determine if focusItem is an Item
function isItem(item: any): item is Item {
    return item && typeof item === "object" && "name" in item && "type" in item;
}
