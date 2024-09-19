"use client";

import { useState, useEffect } from "react";
import { Item } from "../../../lib/types";
import ItemCard from "./ItemCard";
import "../../Assets/Dnd 1.0 Sheet/dndstyles.css";

export default function Inventory({ inventory }: { inventory: Item[] }) {
    const [ hoveredItem, setHoveredItem ] = useState<Item | null>(null);
    const [ isClient, setIsClient ] = useState(false);

    // Ensures this component only renders on the client
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null; // Don't render anything on the server
    }

    return (
        <div className="d-and-d-character-sheet container-xl mt-5 mb-5 flex flex-col justify-center items-center relative">

            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Item Name</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Type</th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    { inventory.map((item, index) => (
                        <tr
                            key={ index }
                            className="border-t border-gray-200 relative"
                            onMouseEnter={ () => setHoveredItem(item) }
                            onMouseLeave={ () => setHoveredItem(null) }
                        >
                            <ItemCard className="pl-4 text-sm text-gray-700 cursor-pointer underline py-2" key={ index } item={ item } />
                            <td className="px-4 py-2 text-sm text-gray-700">{ item.type }</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{ item.quantity || 1 }</td>
                        </tr>
                    )) }
                </tbody>
            </table>
        </div>
    );
}
