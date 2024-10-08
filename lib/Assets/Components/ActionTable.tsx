import DnDCharacter from "@/lib/DnDCharacter";
import { Feature, Item, Weapon } from "@/lib/types";
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

    const tabs = [ "All", "Action", "Bonus Action", "Reaction", "Other" ];

    useEffect(() => {
        // Reset the arrays before mapping
        let newActionArray: Feature[] = [];
        let newBonusActionArray: Feature[] = [];
        let newReactionArray: Feature[] = [];
        let newOtherArray: Feature[] = [];

        character.features.forEach((feature) => {
            if (feature.type === featureType.Action) {
                newActionArray.push(feature);
            } else if (feature.type === featureType.BonusAction) {
                newBonusActionArray.push(feature);
            } else if (feature.type === featureType.Reaction) {
                newReactionArray.push(feature);
            } else {
                newOtherArray.push(feature);
            }
        });

        // Set the new arrays in state
        setActionArray(newActionArray);
        setBonusActionArray(newBonusActionArray);
        setReactionArray(newReactionArray);
        setOtherArray(newOtherArray);

        // If weapons are also part of the data
        const weapons = convertItemToWeaponArray(character.inventory);
        setWeaponArray(weapons);

        // Set initial filtered array (default to "All" tab)
        setFilteredArray([ ...newActionArray, ...newBonusActionArray, ...newReactionArray, ...newOtherArray, ...weapons ]);
    }, [ character ]);

    useEffect(() => {
        // Update the filtered array whenever the activeTab changes
        filterTotalArray(activeTab);
    }, [ activeTab, actionArray, bonusActionArray, reactionArray, otherArray, weaponArray ]);

    function filterTotalArray(type: string) {
        switch (type) {
            case "All":
                setFilteredArray([ ...actionArray, ...bonusActionArray, ...reactionArray, ...otherArray, ...weaponArray ]);
                break;
            case "Action":
                // Include actions and weapon attacks in the "Action" tab
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

    // Function to handle item selection (both feature and weapon)
    const handleSelectItem = (item: any) => {
        if (setFocusItem) {
            console.log("Selected item: ", item);
            //check if the item is a weapon
            if ('name' in item) {
                item = character.equippedWeapons[ character.equippedWeapons.findIndex((weapon) => weapon.name === item.name) ];
            }

            setFocusItem(item);
        }
    };

    return (
        <div className=" flex-col">
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

            {/* Filtered Content */ }
            <div className=" max-h-[450px] overflow-y-auto h-full">
                { filteredArray.map((item, index) => {
                    // Check if item is a Weapon and convert it to the corresponding item
                    const processedItem = 'name' in item ? findWeaponToItem(item as Weapon, character) : item;

                    // Return the JSX
                    return (
                        <ActionTableRow
                            key={ index }
                            item={ processedItem }
                            setFocusItem={ setFocusItem } // Pass the setFocusItem function
                        />
                    );
                }) }
            </div>
        </div>
    );
}


// Function to convert the character's items to weapon array
function convertItemToWeaponArray(items: Item[]): Weapon[] {
    let weaponArray: Weapon[] = [];

    items.forEach((item) => {
        if (item.type === "Weapon") {
            weaponArray.push(convertItemToWeapon(item));
        }
    });

    return weaponArray;
}

function findWeaponToItem(target: Weapon, char: DnDCharacter) {
    let item = char.equippedWeapons[ char.equippedWeapons.findIndex((weapon) => weapon.name === target.name) ];
    return item;
}
