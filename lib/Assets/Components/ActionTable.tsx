import DnDCharacter from "@/lib/DnDCharacter";
import { Item, Weapon } from "@/lib/types";
import { useState, useEffect } from "react";
import { featureType } from "@prisma/client";
import { convertItemToWeapon, TestParagraphs } from "@/lib/utils";

export default function ActionTable({ character }: { character: DnDCharacter }) {

    const [ activeTab, setActiveTab ] = useState<string>("All");

    const tabs = [
        "All",
        "Action",
        "Bonus Action",
        "Reaction",
        "Other"
    ];

    let actionArray: any = [];
    let bonusActionArray = [];
    let reactionArray = [];
    let otherArray = [];
    let weaponArray = [];


    //Base options: Attack, Dash, Disengage, Dodge, Grapple, Help, Hide, Improvise, Influence, Magic, Ready, Search, Shove, Study, Utilize

    return (
        <div className="flex flex-col">
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
            <div className="bg-white p-5 rounded-lg h-full max-h-[450px] overflow-y-auto">

            </div>
        </div>
    );

}


function convertItemToWeaponArray(items: Item[]): Weapon[] {

    let weaponArray: Weapon[] = [];

    items.forEach((item) => {
        if (item.type === "Weapon") {
            weaponArray.push(convertItemToWeapon(item));
        }
    });

    return weaponArray;

}