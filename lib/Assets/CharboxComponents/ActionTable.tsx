import DnDCharacter from "@/lib/DnDCharacter";
import { Feature, Weapon, Item } from "@/lib/types";
import { convertItemToWeapon } from "@/lib/utils";
import { featureType } from "@prisma/client";
import { useEffect, useState } from "react";
import ActionTableRow from "./ActionTableRow";

export default function ActionTable({ character, setFocusItem }: { character: DnDCharacter, setFocusItem?: (value: any) => void }) {
    const [ activeTab, setActiveTab ] = useState<string>("All");
    const [ actionArray, setActionArray ] = useState<Feature[]>([]);
    const [ bonusActionArray, setBonusActionArray ] = useState<Feature[]>([]);
    const [ reactionArray, setReactionArray ] = useState<Feature[]>([]);
    const [ otherArray, setOtherArray ] = useState<Feature[]>([]);
    const [ weaponArray, setWeaponArray ] = useState<Weapon[]>([]);
    const [ filteredArray, setFilteredArray ] = useState<(Feature | Weapon)[]>([]);

    const tabs = [ "All", "Attack", "Action", "Bonus Action", "Reaction", "Other" ];

    useEffect(() => {
        let newActionArray: Feature[] = [];
        let newBonusActionArray: Feature[] = [];
        let newReactionArray: Feature[] = [];
        let newOtherArray: Feature[] = [];

        // charecter.features is now an object, so we need to convert it to an array, same with raec features

        let characterFeatures = Object.values(character.features);

        let raceFeatures = Object.values(character.race?.features || {});

        let totalArray = [ ...characterFeatures, ...raceFeatures ];

        totalArray.forEach((feature) => {
            if (feature.type === featureType.Passive) {
                newOtherArray.push(feature);
            }
            else if (feature.type === featureType.Action) {
                newActionArray.push(feature);
            } else if (feature.type === featureType.BonusAction) {
                newBonusActionArray.push(feature);
            } else if (feature.type === featureType.Reaction) {
                newReactionArray.push(feature);
            } else {
                newOtherArray.push(feature);
            }
        });

        setActionArray(newActionArray);
        setBonusActionArray(newBonusActionArray);
        setReactionArray(newReactionArray);
        setOtherArray(newOtherArray);

        const weapons = convertItemToWeaponArray(Object.values(character.equippedWeapons));
        setWeaponArray(weapons);

        setFilteredArray([ ...newActionArray, ...newBonusActionArray, ...newReactionArray, ...newOtherArray, ...weapons ]);
    }, [ character ]);

    useEffect(() => {
        filterTotalArray(activeTab);
    }, [ activeTab, actionArray, bonusActionArray, reactionArray, otherArray, weaponArray ]);

    function filterTotalArray(type: string) {
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
    }

    return (
        <div className="flex-col">
            <button className="btn btn-primary mb-5 size-full"
                onClick={ () => {
                    console.log(character.equippedWeapons);
                } }
            >RTAHHHHHHHHHHHHHHHHHHHH</button>
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
            <div className="max-h-[450px] overflow-y-auto h-full">
                <table className="table w-full overflow-x-auto min-w-[710px]">
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
                                setFocusItem={ setFocusItem }
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
    let weaponArray: Weapon[] = [];

    items.forEach((item) => {
        if (item.type === "Weapon") {
            weaponArray.push(convertItemToWeapon(item));
        }
    });

    return weaponArray;
}
