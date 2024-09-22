"use client";

import { useState } from "react";
import Inventory from "./Inventory";
import DnDCharacter from "@/lib/DnDCharacter";

export default function CharacterBox({ charecter }: { charecter?: DnDCharacter }) {
    // Tabs array
    const tabs = [
        "Actions",
        "Spells",
        "Inventory",
        "Feats/Traits",
        "Background",
        "Notes",
        "Extras",
    ];

    // State to keep track of the active tab
    const [ activeTab, setActiveTab ] = useState<string>("Inventory");

    return (
        <div className="container mx-auto p-5">
            {/* Tabs Header */ }
            <div className="flex border-b border-gray-300 mb-5">
                { tabs.map((tab) => (
                    <button
                        key={ tab }
                        className={ `px-4 py-2 font-semibold text-sm text-gray-600 border-b-2 ${activeTab === tab
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent hover:border-gray-400"
                            }` }
                        onClick={ () => setActiveTab(tab) }
                    >
                        { tab }
                    </button>
                )) }
            </div>

            {/* Tab Content */ }
            <div className="bg-white p-5 rounded-lg shadow-lg">
                { activeTab === "Inventory" ? (
                    <div>
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold mb-3">{ activeTab }</h2>
                            <button className="btn"
                                onClick={ () => console.log("To be added") }
                            >Manage Inventory</button>
                        </div>
                        <Inventory inventory={ charecter?.inventory } />
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-bold mb-3">{ activeTab }</h2>
                        <p>Work in Progress: { activeTab } content will be added here.</p>
                    </div>
                ) }
            </div>
        </div>
    );
}
