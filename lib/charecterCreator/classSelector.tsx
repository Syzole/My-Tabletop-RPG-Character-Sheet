"use client";

import rougeStartData from "@/characters/class/rouge.json";
import DnDCharacter from "@/lib/DnDCharacter";
import { classSkeleton } from "@/lib/types";
import { useState } from "react";


let mapOfClases = new Map<string, classSkeleton>();

const baseStats = {
    str: 10,
    dex: 10,
    con: 10,
    int: 10,
    wis: 10,
    cha: 10,
}

mapOfClases.set(`${rougeStartData.name},${rougeStartData.version}`, { ...rougeStartData, hitDie: rougeStartData.hitDice } as classSkeleton);

export default function ClassSelector() {
    const [ classSelected, setClassSelected ] = useState("");
    const [ choiceConfirmed, setChoiceConfirmed ] = useState(false);
    const [ classData, setClassData ] = useState<classSkeleton | undefined>();
    const [ stats, setStats ] = useState(baseStats);

    const handleClassSelection = (key: string) => {
        const selectedClassData = mapOfClases.get(key);
        if (selectedClassData && window.confirm(`Are you sure you want to select the ${selectedClassData.name} class?`)) {
            setClassSelected(key);
            setClassData(selectedClassData);
            setChoiceConfirmed(true);
        }
    };

    return (
        <div className="flex flex-col items-center gap-6 p-6">
            { !choiceConfirmed && ( // If the user has not confirmed their choice
                <div>
                    <h2 className="text-2xl font-bold text-gray-700">Select a Class</h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        { Array.from(mapOfClases.keys()).map((key) => {
                            return (
                                <button
                                    className="btn-secondary bg-slate-300 px-4 py-2 rounded-lg text-gray-800 font-medium hover:bg-slate-400 focus:ring-2 focus:ring-slate-500"
                                    key={ key }
                                    onClick={ () => {
                                        handleClassSelection(key);
                                    } }
                                >
                                    { key }
                                </button>
                            );
                        }) }
                    </div>
                </div>) }

            { choiceConfirmed && (
                <div className="flex flex-col items-center gap-6">
                    <h2 className="text-2xl font-bold text-gray-700">Class Selected</h2>
                    <p className="text-lg text-gray-800">You have selected the { classSelected } class.</p>
                    <p className="text-lg text-gray-800">Please create your statblock</p>
                    <div className="flex flex-row gap-4">
                        {
                            Object.entries(baseStats).map(([ key, value ]) => (
                                <div key={ key } className="stat-item">
                                    <span className="stat-key">{ key }: </span>
                                    <input
                                        type="number"
                                        className="stat-value w-16 p-1 border rounded"
                                        onChange={ (e) => {
                                            const newStats = { ...baseStats };
                                            newStats[ key as keyof typeof baseStats ] = parseInt(e.target.value) || 0;
                                            setStats(newStats);
                                        } }
                                        min="1"
                                        max="20"
                                    />
                                </div>
                            ))
                        }
                        <p>Stats: </p>
                        <p>{ JSON.stringify(stats) }</p>
                    </div>
                </div>) }
        </div>
    );
}

function transformCharecter(char: DnDCharacter, data: classSkeleton) {
    char.classLevel = data.name;
    char.hitDiceMax[ data.hitDice ] = 1;
}
