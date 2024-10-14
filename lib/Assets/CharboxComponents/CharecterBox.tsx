"use client";

import { useState } from "react";
import Inventory from "./Inventory";
import ActionTable from "./ActionTable"; // Import the new ActionTable component
import DnDCharacter from "@/lib/DnDCharacter";
import FeatsTable from "./FeatsTable";

export default function CharacterBox({
    charecter,
    updateCharacter,
    setFocusItem
}: {
    charecter?: DnDCharacter,
    updateCharacter: (field: string, value: any) => void,
    setFocusItem?: (item: any) => void
}) {
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
    const [ activeTab, setActiveTab ] = useState<string>("Actions");

    return (
        <div className="container mx-auto p-5 flex flex-col h-full">
            {/* Tabs Header */ }
            <div role="tablist" className="tabs mb-5 tabs-boxed">
                { tabs.map((tab) => (
                    <a
                        key={ tab }
                        className={ `tab tab-bordered ${activeTab === tab ? "tab-active" : ""}` }
                        onClick={ () => {
                            setActiveTab(tab);
                        } }
                    >
                        { tab }
                    </a>
                )) }
            </div>

            {/* Tab Content */ }
            <div className="bg-base-100 p-5 rounded-lg shadow-lg h-full">
                { activeTab === "Inventory" && (
                    <Inventory charecter={ charecter } updateCharacter={ updateCharacter } setFocusItem={ setFocusItem! } />
                ) }
                { activeTab === "Actions" && (
                    <ActionTable character={ charecter! } setFocusItem={ setFocusItem } />
                ) }
                { activeTab === "Feats/Traits" && (
                    <FeatsTable character={ charecter! } setFocusItem={ setFocusItem! } />
                ) }
            </div>
        </div>
    );
}
