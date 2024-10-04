"use client";

import React from "react";
import { Item } from "@/lib/types";
import ItemCard from "./ItemCard";

export default function FocusCol({
    focusItem,
    setFocusItem,
}: {
    focusItem?: any;
    setFocusItem?: (value: any) => void;
}) {
    // Determine what kind of content to display
    if (!focusItem) {
        return null;
    }

    return (
        <>
            { focusItem && (
                <div className="focus-col-container p-4 border-l border-gray-300 fixed bg-slate-900 top-1/2 -translate-y-1/2 ">
                    { isItem(focusItem) && (
                        <>
                            <button
                                className="btn bg-black text-white mb-2"
                                onClick={ () => setFocusItem && setFocusItem(null) }
                            >
                                Close
                            </button>
                            <ItemCard item={ focusItem as Item } />
                        </>
                    ) }
                </div>
            ) }
        </>
    );


}

// Helper function to determine if focusItem is an Item
function isItem(item: any): item is Item {
    return item && typeof item === "object" && "name" in item && "type" in item;
}
