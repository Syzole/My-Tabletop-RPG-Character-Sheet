"use client";

import React, { useState } from "react";

interface ItemProps {
    item: {
        name: string;
        source: string[];
        type: string;
        rarity?: string;
        value?: number;
        weight?: number;
        quantity?: number;
        properties: { [ key: string ]: any };
    };
    className?: string; // Add className prop
}

// Utility function to format the property keys
function formatPropertyKey(key: string): string {
    if (key === "ac") return "AC";
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (str) => str.toUpperCase());
}

const ItemCard: React.FC<ItemProps> = ({ item, className }) => {
    const [ isHovered, setIsHovered ] = useState(false);

    return (
        <div
            className={ `relative inline-block max-w-max ${className}` } // Apply className here
            onMouseEnter={ () => setIsHovered(true) }
            onMouseLeave={ () => setIsHovered(false) }
        >
            <p className="text-xs font-semibold text-gray-800 cursor-pointer underline">
                { item.name }
            </p>

            { isHovered && (
                <div className="absolute left-0 mt-2 w-64 bg-white p-4 rounded-lg shadow-lg z-10">
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
                            <strong>Properties:</strong>
                            <ul className="list-disc list-inside">
                                { Object.keys(item.properties).map((key, index) => (
                                    <li key={ index }>
                                        { formatPropertyKey(key) }: { item.properties[ key ] }
                                    </li>
                                )) }
                            </ul>
                        </div>
                    ) }
                </div>
            ) }
        </div>
    );
};

export default ItemCard;
