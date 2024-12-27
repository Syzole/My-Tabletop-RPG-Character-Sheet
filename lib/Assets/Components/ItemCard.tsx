"use client";

import React from "react";

interface ItemProps {
    item?: {
        name: string;
        source?: string[];
        type: string;
        rarity?: string;
        value?: number;
        weight?: number;
        quantity: number;
        properties: { [ key: string ]: any };
    };
    className?: string; // Add className prop for dynamic positioning
    onClick?: () => void;

}

const keysWeDontWantToDisplay = [ "weaponCategory" ];

// Utility function to format the property keys
export function formatPropertyKey(key: string): string {
    if (key === "ac") return "AC";
    if (key === "dmg1") return "Damage";
    if (key === "dmg2") return "Damage (2 handed)";
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
                <strong>Source:</strong> { item.source ? item.source.join(", ") : " - " }
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
                                    !keysWeDontWantToDisplay.includes(key) && (<li key={ key }>
                                        <strong className="">{ formatPropertyKey(key) }</strong>:{ " " }
                                        {
                                            Array.isArray(value) ? (
                                                <ul className="list-disc list-inside">
                                                    { value.map((entry, index) => (
                                                        <li key={ index }>
                                                            { typeof entry === "string" ? entry : (
                                                                // if the {@deity Lliira|Faerûnian|scag} is the in the properties.entries, return Lliira or {@condition prone} return prone
                                                                <>
                                                                    <strong>{ entry.name }:</strong> { entry.entries.join(" ").replace(/{@([^}]+) ([^|}]+)(\|([^}]+))?}/g, "$2") }
                                                                </>
                                                            ) }
                                                        </li>
                                                    )) }
                                                </ul>
                                            ) : (
                                                value
                                            )
                                        }
                                    </li>)
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
