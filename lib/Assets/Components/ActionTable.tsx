import DnDCharacter from "@/lib/DnDCharacter";
import { Weapon } from "@/lib/types";
import { useState, useEffect } from "react";
import { featureType } from "@prisma/client";

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
    let weaponArray = character.equippedWeapons;



    //Base options: Attack, Dash, Disengage, Dodge, Grapple, Help, Hide, Improvise, Influence, Magic, Ready, Search, Shove, Study, Utilize

    return (
        <div>
            {
                //make a few tabs onm top for All, Action, Bonus Action, Reaction, Other
            }
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
            <div className="bg-white p-5 rounded-lg h-full max-h-[500px] overflow-y-auto">
                { // fill this up with ALOT of text to check if it scrolls do not do anything with the tabs
                }
            </div>
        </div>
    );

}