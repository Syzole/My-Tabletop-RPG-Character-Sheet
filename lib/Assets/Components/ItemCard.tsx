"use client";

import React, { useState } from "react";

interface ItemProps {
    item?: {
        name: string;
        source: string[];
        type: string;
        rarity?: string;
        value?: number;
        weight?: number;
        quantity?: number;
        properties: { [ key: string ]: any };
    };
    className?: string; // Add className prop for dynamic positioning
    onClick?: () => void;

}

// Utility function to format the property keys
function formatPropertyKey(key: string): string {
    if (key === "ac") return "AC";
    if (key === "dmg1") return "Damage";
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
}

const ItemCard: React.FC<ItemProps> = ({ item, className, onClick }) => {

    if (!item) {
        return (
            <div className={ ` mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10 ${className}` }>
                <p>No item selected.</p>
            </div>
        );
    }

    return (
        <div className={ `mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10 ${className}` }
            onClick={ onClick }
        >
            <h3 className="text-lg font-semibold text-indigo-600">
                { item.name }
            </h3>
            <p className="text-sm text-gray-600">
                <strong>Source:</strong> { item.source.join(", ") }
            </p>
            <p className="text-sm text-gray-600">
                <strong>Type:</strong> { item.type }
            </p>
            { item.rarity && (
                <p className="text-sm text-gray-600">
                    <strong>Rarity:</strong> { item.rarity }
                </p>
            ) }
            { item.value && (
                <p className="text-sm text-gray-600">
                    <strong>Value:</strong> { item.value } gp
                </p>
            ) }
            { item.weight && (
                <p className="text-sm text-gray-600">
                    <strong>Weight:</strong> { item.weight } lbs
                </p>
            ) }

            { item.properties && (
                <div className="text-sm text-gray-600 mt-2">
                    { Object.keys(item.properties).length !== 0 ? (
                        <div>
                            <h4 className="text-indigo-600 font-semibold">Properties</h4>
                            <ul>
                                { Object.entries(item.properties).map(([ key, value ]) => (
                                    <li key={ key }>
                                        <strong className="">{ formatPropertyKey(key) }</strong>:{ " " }
                                        { typeof value === "object"
                                            ? Array.isArray(value)
                                                ? value.join(", ") // If it's an array, join the values with commas
                                                : JSON.stringify(value, null, 2) // If it's an object, convert it to a JSON string with indentation
                                            : value // If it's a primitive value, just display it
                                        }
                                    </li>
                                )) }
                            </ul>
                        </div>
                    ) : (
                        <p>No properties.</p>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default ItemCard;
