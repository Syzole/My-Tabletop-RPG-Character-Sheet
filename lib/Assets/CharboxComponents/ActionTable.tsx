import DnDCharacter from "@/lib/DnDCharacter";
import { Feature, Weapon, Item } from "@/lib/types";
import { convertItemToWeapon } from "@/lib/utils";
import { featureType } from "@prisma/client";
import { useEffect, useMemo, useCallback, useState } from "react";
import ActionTableRow from "./ActionTableRow";

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
        return Object.values(character.features).filter((feature) =>
            !([ featureType.Action, featureType.BonusAction, featureType.Reaction ] as featureType[]).includes(feature.type as featureType)
        );
    }, [ character.features ]);

    const weaponArray = useMemo(() => {
        return convertItemToWeaponArray(Object.values(character.equippedWeapons));
    }, [ character.equippedWeapons ]);

    // Memoize filtered array to only recalculate when activeTab or relevant arrays change
    useEffect(() => {
        filterTotalArray(activeTab);
    }, [ activeTab, actionArray, bonusActionArray, reactionArray, otherArray, weaponArray ]);

    // Memoize filterTotalArray function to prevent unnecessary re-renders
    const filterTotalArray = useCallback((type: string) => {
        switch (type) {
            case "All":
                setFilteredArray([ ...actionArray, ...bonusActionArray, ...reactionArray, ...otherArray, ...weaponArray ]);
                break;
            case "Attack":
                setFilteredArray(weaponArray);
                break;
            case "Action":
                setFilteredArray([ ...actionArray, ...weaponArray ]);
                break;
            case "Bonus Action":
                setFilteredArray(bonusActionArray);
                break;
            case "Reaction":
                setFilteredArray(reactionArray);
                break;
            case "Other":
                setFilteredArray(otherArray);
                break;
            default:
                setFilteredArray([]);
        }
    }, [ actionArray, bonusActionArray, reactionArray, otherArray, weaponArray ]);

    return (
        <div className="flex-col">
            {/* Tabs Header */ }
            <div className="tabs mb-5 tabs-boxed">
                { tabs.map((tab) => (
                    <a
                        key={ tab }
                        className={ `tab tab-bordered ${activeTab === tab ? "tab-active" : ""}` }
                        onClick={ () => setActiveTab(tab) } // Using memoized handler
                    >
                        { tab }
                    </a>
                )) }
            </div>

            {/* Filtered Content Table */ }
            <div className="h-full max-h-[470px] overflow-y-auto">
                <table className="table w-full overflow-auto min-w-[710px] ">
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
        </div>
    );
}

// Convert items to weapons for the table
function convertItemToWeaponArray(items: Item[]): Weapon[] {
    return items
        .filter(item => item.type === "Weapon")
        .map(convertItemToWeapon);
}
