"use client";

import React from "react";
import { Item, Feature, Weapon } from "@/lib/types";
import ItemCard from "./ItemCard";
import FeatureCard from "./FeatureCard";
import DnDCharacter from "@/lib/DnDCharacter";

export default function FocusCol({
    focusItem,
    setFocusItem,
    character,
    updateCharacter
}: {
    focusItem?: any;
    setFocusItem?: (value: any) => void;
    character: DnDCharacter;
    updateCharacter: (key: string, defaultValue: any) => void;
}) {
    // Determine what kind of content to display
    if (!focusItem) {
        return null;
    }

    if ('damage' in focusItem) {
        focusItem = findWeaponToItem(focusItem as Weapon, character);
    }

    return (
        <>
            { focusItem && (
                <div className="focus-col-container p-4 border-l border-gray-300 fixed bg-slate-900 top-1/2 -translate-y-1/2 max-h-screen overflow-auto">
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
                    { isFeature(focusItem) && (
                        <div>
                            <button
                                className="btn bg-black text-white mb-2"
                                onClick={ () => setFocusItem && setFocusItem(null) }
                            >
                                Close
                            </button>
                            <FeatureCard feature={ focusItem as Feature } updateCharacter={ updateCharacter } charecter={ character } />
                        </div>
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

function isFeature(item: any): item is Feature {
    return item && typeof item === "object" && "feature_name" in item;
}


function findWeaponToItem(target: Weapon, char: DnDCharacter) {
    let item = char.equippedWeapons[ char.equippedWeapons.findIndex((weapon) => weapon.name === target.name) ];
    return item;
}
