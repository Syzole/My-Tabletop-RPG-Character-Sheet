import { Character } from "@/types/character";
import { useState } from "react";

import ActionBox from "./actionBox";
import InventoryBox from "./inventoryBox";
import CharacterFeatureBox from "./characterFeatureBox";
import useCharacterStore from "@/stores/CharacterStore";
import SpellBox from "./spellBox";


const tabs = [
    "Actions",
    "Spells",
    "Inventory",
    "Character",
    "Background",
    "Notes",
    "Extras",
];

export default function MainBox() {

    const [ activeTab, setActiveTab ] = useState<string>("Inventory");
    const { character } = useCharacterStore();

    if (!character) {
        return <div>Loading character...</div>;
    }

    return (
        <div
            className="d-and-d-box gray flex flex-col w-full h-[600px] "
        >
            <div role="tablist" className="tabs mb-5 tabs-box justify-between " >
                { tabs.map((tab) => (
                    <a
                        key={ tab }
                        className={ `
                        tab px-6 py-3 transition-all duration-300 ease-in-out grow
                        ${activeTab === tab ? "tab-active scale-105" : "opacity-70"}
                        `}
                        onClick={ () => setActiveTab(tab) }
                    >
                        { tab }
                    </a>
                )) }
            </div>
            <div
                className="bg-base-100 p-5 rounded-lg shadow-lg h-full overflow-auto no-scrollbar"
            >
                { activeTab === "Actions" && <ActionBox /> }
                { activeTab === "Spells" && <SpellBox /> }
                { activeTab === "Inventory" && <InventoryBox /> }
                { activeTab === "Character" && <CharacterFeatureBox /> }
                { activeTab === "Background" && <div>Background</div> }
                { activeTab === "Notes" && <div>Notes</div> }
                { activeTab === "Extras" && <div>Extras</div> }
            </div>
        </div>
    );
}