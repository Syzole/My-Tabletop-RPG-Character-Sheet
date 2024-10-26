import DnDCharacter from "@/lib/DnDCharacter";
import { Feature, Weapon, Item } from "@/lib/types";
import { convertItemToWeapon } from "@/lib/utils";
import { featureType } from "@prisma/client";
import { useEffect, useMemo, useCallback, useState } from "react";
import ActionTableRow from "./ActionTableRow";
import SubActionTable from "./SubActionTable"; // <-- Import SubActionTable

export default function ActionTable({ character, setFocusItem }: { character: DnDCharacter, setFocusItem?: (value: any) => void }) {
    const [ activeTab, setActiveTab ] = useState<string>("All");
    const [ filteredArray, setFilteredArray ] = useState<(Feature | Weapon)[]>([]);

    const tabs = [ "All", "Attack", "Action", "Bonus Action", "Reaction", "Other" ];

    // Memoize action arrays to avoid recalculating on every render
    const actionArray = useMemo(() => {
        return Object.values(character.features).filter((feature) => feature.type === featureType.Action);
    }, [ character.features ]);

    const bonusActionArray = useMemo(() => {
        return Object.values(character.features).filter((feature) => feature.type === featureType.BonusAction);
    }, [ character.features ]);

    const reactionArray = useMemo(() => {
        return Object.values(character.features).filter((feature) => feature.type === featureType.Reaction);
    }, [ character.features ]);

    const otherArray = useMemo(() => {
        let otherFeatures = Object.values(character.features).filter((feature) => feature.type === featureType.Other);
        return otherFeatures;
    }, [ character.features ]);

    const weaponArray = useMemo(() => {
        return convertItemToWeaponArray(Object.values(character.equippedWeapons));
    }, [ character.equippedWeapons ]);

    // Memoize filterTotalArray function to prevent unnecessary re-renders
    const filterTotalArray = useCallback((type: string) => {
        const filterMap: { [ key: string ]: (Feature | Weapon)[] } = {
            "All": [ ...actionArray, ...bonusActionArray, ...reactionArray, ...otherArray, ...weaponArray ],
            "Attack": weaponArray,
            "Action": [ ...actionArray, ...weaponArray ],
            "Bonus Action": bonusActionArray,
            "Reaction": reactionArray,
            "Other": otherArray,
        };
        setFilteredArray(filterMap[ type ] || []);
    }, [ actionArray, bonusActionArray, reactionArray, otherArray, weaponArray ]);

    // Memoize filtered array to only recalculate when activeTab or relevant arrays change
    useEffect(() => {
        filterTotalArray(activeTab);
    }, [ activeTab, actionArray, bonusActionArray, reactionArray, otherArray, weaponArray, filterTotalArray ]);

    return (
        <div className="flex-col max-h-[520px] overflow-auto min-w-[710px] max-w-[970px]">
            {/* Tabs Header */ }
            <div className="tabs mb-5 tabs-boxed">
                { tabs.map((tab) => (
                    <a
                        key={ tab }
                        className={ `tab tab-bordered ${activeTab === tab ? "tab-active" : ""}` }
                        onClick={ () => setActiveTab(tab) }
                    >
                        { tab }
                    </a>
                )) }
            </div>

            {/* Filtered Content Table */ }
            <div className="h-full ">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Attack</th>
                            <th className="px-4 py-2">Range</th>
                            <th className="px-4 py-2">Hit/DC</th>
                            <th className="px-4 py-2">Damage</th>
                            <th className="px-4 py-2">Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        { filteredArray.map((item, index) => (
                            <ActionTableRow
                                key={ index }
                                item={ item }
                                setFocusItem={ setFocusItem } // Keep as is
                                character={ character }  // Pass the character to the row
                            />
                        )) }
                    </tbody>
                </table>
            </div>
            {/* Sub-Action Table for Descriptions */ }
            <SubActionTable selectedAction={ activeTab } />
        </div>
    );
}

// Convert items to weapons for the table
function convertItemToWeaponArray(items: Item[]): Weapon[] {
    return items
        .filter(item => item.type === "Weapon")
        .map(convertItemToWeapon);
}
