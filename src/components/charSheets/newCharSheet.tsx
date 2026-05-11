import "@/styles/dndstyles.css";
import { Character } from "@/types/character";

// Helper function are imported here
import { SkillName, skillStatMap } from "@/types/skills";
import { calculateAC, calculateInitiative } from "@/utils/character";
import { calculateSavingThrow } from "@/utils/savingThrows";
import { calculateSkillModifier, camelCaseToTitleCase } from "@/utils/skills";

// Importing sub-components for the D&D character sheet
import { capitalizeFirstLetter } from "@/utils/text";
import MainBox from "@/components/charBox/mainBox";
import DeathSave from "@/components/charSheetsSubParts/DeathSave";
import Skill from "@/components/charSheetsSubParts/Skill";
import StatBox from "@/components/charSheetsSubParts/StatBox";
import StatBox2 from "@/components/charSheetsSubParts/StatBox2";
import StatRow from "@/components/charSheetsSubParts/StatRow";

//Import some new zustand store :D
import useCharacterStore from "@/stores/CharacterStore";
import useFocusStore from "@/stores/FocusStore";
import { useEffect } from "react";
import FocusCol from "@/components/lib/FocusCol";


type DnDCharacterStatsSheetProps = {
	/** Optional: pushes initial/demo character into the store when provided */
	characterProp?: Character;
};

export default function DnDCharacterStatsSheet({ characterProp }: DnDCharacterStatsSheetProps) {
    const { character, setCharacter, updateCharacterField } = useCharacterStore();
    const { focusItem, setFocusItem } = useFocusStore();

    // Sync prop → store on mount or when prop changes (e.g. demo data from parent)
    useEffect(() => {
        if (characterProp) setCharacter(characterProp);
    }, [ characterProp, setCharacter ]);

    // Update helper
    const updateCharacter = (name: keyof Character, defaultValue: any) => {
        console.log("Updating character field:", name, "with value:", defaultValue);
        updateCharacterField(name, defaultValue);
    };

    if (!character) return <div>Loading...</div>;

    return (
        <div className="d-and-d-character-sheet container-xl mt-5 mb-5 flex flex-col">
            <div className="row mb-4 flex justify-center items-center">
                <div className="col-md-3 pr-2 pl-2">
                    <div className="d-and-d-page-title">D&D</div>
                    <div className="d-and-d-attribute-collection char-name pr-3 pl-3">
                        <input
                            type="text"
                            defaultValue={ character.name ? character.name : "" }
                        />
                    </div>
                    <label
                        style={ {
                            width: "100%",
                            textAlign: "right",
                            textTransform: "uppercase",
                            fontSize: "11px",
                        } }
                    >
                        Character Name
                    </label>
                </div>
                <div className="col-md-9 pr-2 pl-2 flex ">
                    <div className="d-and-d-attribute-collection pr-3 pl-3">
                        <div className="row pl-3 pr-3 flex w-fit">
                            <div className="col-md-3 col-6 pl-0 pr-0">
                                <input
                                    type="text"
                                    defaultValue={
                                        character.class ? character.class : " " + character.level
                                    }
                                />
                                <label>Class & Level</label>
                            </div>
                            <div className="col-md-3 col-6 pl-0 pr-0">
                                <input
                                    type="text"
                                    defaultValue={
                                        character.background ? character.background : ""
                                    }
                                />
                                <label>Background</label>
                            </div>
                            <div className="col-md-3 col-6 pl-0 pr-0">
                                <input
                                    type="text"
                                    defaultValue={
                                        character.playerName ? character.playerName : ""
                                    }
                                />
                                <label>Player Name</label>
                            </div>
                            <div className="col-md-3 col-6 pl-0 pr-0">
                                <input type="text" defaultValue={ "" } />
                                <label>Faction</label>
                            </div>
                        </div>
                        <div className="row pl-3 pr-3 flex">
                            <div className="col-md-3 col-6 pl-0 pr-0 w-72">
                                <input
                                    type="text"
                                    defaultValue={ character.race ? character.race.name : "" }
                                />
                                <label>Race</label>
                            </div>
                            <div className="col-md-3 col-6 pl-0 pr-0">
                                <input
                                    type="text"
                                    defaultValue={
                                        character.alignment ? character.alignment : ""
                                    }
                                />
                                <label>Alignment</label>
                            </div>
                            <div className="col-md-3 col-6 pl-0 pr-0">
                                <input
                                    type="text"
                                    defaultValue={
                                        character.experiencePoints
                                            ? character.experiencePoints
                                            : "0"
                                    }
                                />
                                <label>Experience Points</label>
                            </div>
                            <div className="col-md-3 col-6 pl-0 pr-0">
                                <input type="text" defaultValue={ "" } />
                                <label>DCI Number</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {/* <div /> {/* blank spacer */ }
                <div className="flex justify-center grow">
                    <div className="col-md-4 pr-10 flex flex-col">
                        <div className="row flex items-center justify-center">
                            <div className="col-4 pr-6">
                                <div className="d-and-d-box gray">
                                    <StatBox
                                        label="Strength"
                                        name="str"
                                        defaultValue={ character.baseStats.strength }
                                    />
                                    <StatBox
                                        label="Dexterity"
                                        name="dex"
                                        defaultValue={ character.baseStats.dexterity }
                                    />
                                    <StatBox
                                        label="Constitution"
                                        name="con"
                                        defaultValue={ character.baseStats.constitution }
                                    />
                                    <StatBox
                                        label="Intelligence"
                                        name="int"
                                        defaultValue={ character.baseStats.intelligence }
                                    />
                                    <StatBox
                                        label="Wisdom"
                                        name="wis"
                                        defaultValue={ character.baseStats.wisdom }
                                    />
                                    <StatBox
                                        label="Charisma"
                                        name="cha"
                                        defaultValue={ character.baseStats.charisma }
                                    />
                                </div>
                            </div>
                            <div className="col-8">
                                <StatRow
                                    label="Inspiration"
                                    name="inspiration"
                                    defaultValue={ character.inspiration ? "X" : "O" }
                                />
                                <StatRow
                                    classes="rounded"
                                    label="Proficiency Bonus"
                                    name="proficiencyBonus"
                                    defaultValue={ character.proficiencyBonus }
                                />
                                <div className="d-and-d-box">
                                    <div style={ { textAlign: "left" } }>
                                        <Skill
                                            label="Strength"
                                            defaultValue={
                                                String(calculateSavingThrow(character, "strength"))
                                            }
                                            targetSkill={ character.savingThrows[ "strength" ] }
                                        />
                                        <Skill
                                            label="Dexterity"
                                            defaultValue={
                                                String(calculateSavingThrow(character, "dexterity"))
                                            }
                                            targetSkill={ character.savingThrows[ "dexterity" ] }
                                        />
                                        <Skill
                                            label="Constitution"
                                            targetSkill={ character.savingThrows[ "constitution" ] }
                                            defaultValue={
                                                String(calculateSavingThrow(character, "constitution"))
                                            }
                                        />
                                        <Skill
                                            label="Intelligence"
                                            targetSkill={ character.savingThrows[ "intelligence" ] }
                                            defaultValue={
                                                String(calculateSavingThrow(character, "intelligence"))
                                            }
                                        />
                                        <Skill
                                            label="Wisdom"
                                            targetSkill={ character.savingThrows[ "wisdom" ] }
                                            defaultValue={
                                                String(calculateSavingThrow(character, "wisdom"))
                                            }
                                        />
                                        <Skill
                                            label="Charisma"
                                            targetSkill={ character.savingThrows[ "charisma" ] }
                                            defaultValue={
                                                String(calculateSavingThrow(character, "charisma"))
                                            }
                                        />
                                    </div>
                                    <label
                                        className="d-and-d-title"
                                        style={ { marginTop: "10px" } }
                                    >
                                        Saving Throws
                                    </label>
                                </div>
                                <div className="d-and-d-box">
                                    <div style={ { textAlign: "left" } }>
                                        { Object.entries(skillStatMap).map(([ skill, stat ]) => (
                                            <Skill
                                                key={ skill } // Ensure a unique key prop for each Skill component
                                                label={ camelCaseToTitleCase(skill) } // Display name of the skill
                                                targetSkill={ character.skills[ skill as SkillName ] }
                                                defaultValue={
                                                    calculateSkillModifier(character, skill as SkillName)
                                                } // Skill modifier
                                            //checked={character.[skill as SkillName] === "Proficient" || character.skillProficiencies[skill as SkillName] === "Expertise"} // Proficiency check
                                            />
                                        )) }
                                    </div>
                                    <label
                                        className="d-and-d-title"
                                        style={ { marginTop: "10px" } }
                                    >
                                        Skills
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            <StatRow
                                classes="rounded rounded-sides"
                                label="Passive Wisdom (Perception)"
                                name="passivePerception"
                                defaultValue={ String(
                                    calculateSkillModifier(character, "perception") + 10
                                ) }
                            />
                        </div>
                        <div className="d-and-d-box d-and-d-textarea mt-4 flex flex-col grow">
                            <textarea
                                value={
                                    character.proficiencies
                                        ? Object.entries(character.proficiencies)
                                            .map(([ key, value ]) => {
                                                if (value instanceof Set) {
                                                    return `${capitalizeFirstLetter(key)}: ${Array.from(value).map(capitalizeFirstLetter).join(", ") || "None"}`;
                                                }
                                                return `${capitalizeFirstLetter(key)}: ${value.length > 0 ? value : "Nothing"}`;
                                            })
                                            .join("\n------------------------------\n")
                                        : "Nothing"
                                }
                                readOnly
                                rows={ 12 }
                                className="grow"
                            />
                            <label className="d-and-d-title" style={ { marginTop: "10px" } }>
                                Other Proficiencies & Languages
                            </label>
                        </div>
                    </div>
                    <div className="w-1/2 flex flex-col ">
                        <div className="flex">
                            <div className="d-and-d-box gray mr-4 flex flex-col w-2/3">
                                <div className="row flex">
                                    <div className="col-4">
                                        <StatBox2
                                            classes="shield"
                                            labelTop="Armour"
                                            label="Class"
                                            name="ac"
                                            defaultValue={ calculateAC(character) }
                                        />
                                    </div>
                                    <div className="col-4  pl-2">
                                        <StatBox2
                                            label="Initiative"
                                            name="init"
                                            defaultValue={
                                                calculateInitiative(character) > 0
                                                    ? "+" + calculateInitiative(character)
                                                    : ""
                                            }
                                        />
                                    </div>
                                    <div className="col-4 pl-2">
                                        <StatBox2
                                            label="Speed"
                                            name="speed"
                                            defaultValue={ character.speed.walk }
                                        />
                                    </div>
                                </div>
                                <div
                                    className="d-and-d-box white"
                                    style={ {
                                        borderRadius: "8px 8px 0 0",
                                        marginBottom: "5px",
                                        paddingBottom: "5px",
                                    } }
                                >
                                    <div className="d-and-d-gray-text">
                                        <label style={ { width: "95px" } }>Hit Point Maximum</label>
                                        <input
                                            type="text"
                                            style={ { width: "calc(100% - 95px)" } }
                                            className="d-and-d-linput"
                                            defaultValue={
                                                character.hitPoints ? character.hitPoints.max : ""
                                            }
                                        />
                                    </div>
                                    <input
                                        type="text"
                                        className="d-and-d-cinput"
                                        value={ character.hitPoints ? character.hitPoints.current : "" }
                                        onChange={ (e) => {
                                            updateCharacter("hitPoints", {
                                                ...character.hitPoints,
                                                current: Number(e.target.value),
                                            });
                                        } }
                                    />
                                    <label className="d-and-d-title" style={ { marginTop: "5px" } }>
                                        Current Hit Points
                                    </label>
                                </div>
                                <div
                                    className="d-and-d-box white mb-2"
                                    style={ { borderRadius: "0 0 8px 8px", paddingBottom: "5px" } }
                                >
                                    <input
                                        type="text"
                                        className="d-and-d-cinput"
                                        defaultValue={
                                            character.hitPoints.temporary
                                                ? character.hitPoints.temporary
                                                : "0"
                                        }
                                    />
                                    <label className="d-and-d-title" style={ { marginTop: "5px" } }>
                                        Temporary Hit Points
                                    </label>
                                </div>
                                <div className="row mt-1 flex">
                                    <div className="col-6 pr-1">
                                        <div
                                            className="d-and-d-box white mb-0"
                                            style={ { paddingBottom: "5px" } }
                                        >
                                            { character.hitDice && Object.keys(character.hitDice).length > 0 ? (
                                                Object.entries(character.hitDice).map(([ diceType, diceData ]) => (
                                                    <div key={ diceType } style={ { marginBottom: "8px" } }>
                                                        <div className="d-and-d-gray-text">
                                                            <label style={ { width: "25px" } }>Total</label>
                                                            <input
                                                                type="text"
                                                                style={ { width: "calc(100% - 25px)" } }
                                                                className="d-and-d-linput"
                                                                value={ diceData.total + diceType }
                                                                onChange={ (e) => {
                                                                    // Extract numeric value from input (handles "5d8", "5", etc.)
                                                                    const match = e.target.value.match(/^\d+/);
                                                                    const newTotal = match ? parseInt(match[ 0 ]) : 0;
                                                                    updateCharacter("hitDice", {
                                                                        ...character.hitDice,
                                                                        [ diceType ]: { ...diceData, total: newTotal },
                                                                    });
                                                                } }
                                                            />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="d-and-d-cinput"
                                                            value={ diceData.used }
                                                            onChange={ (e) => {
                                                                const newUsed = parseInt(e.target.value) || 0;
                                                                updateCharacter("hitDice", {
                                                                    ...character.hitDice,
                                                                    [ diceType ]: { ...diceData, used: newUsed },
                                                                });
                                                            } }
                                                        />
                                                        <label
                                                            className="d-and-d-title"
                                                            style={ { marginTop: "5px" } }
                                                        >
                                                            Hit Dice ({ diceType })
                                                        </label>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>
                                                    <div className="d-and-d-gray-text">
                                                        <label style={ { width: "25px" } }>Total</label>
                                                        <input
                                                            type="text"
                                                            style={ { width: "calc(100% - 25px)" } }
                                                            className="d-and-d-linput"
                                                            defaultValue="0"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="d-and-d-cinput"
                                                        defaultValue="0"
                                                    />
                                                    <label
                                                        className="d-and-d-title"
                                                        style={ { marginTop: "5px" } }
                                                    >
                                                        Hit Dice
                                                    </label>
                                                </div>
                                            ) }
                                        </div>
                                    </div>
                                    <div className="col-6 pl-1 flex-1 text-center">
                                        <div
                                            className="d-and-d-box white mb-0"
                                            style={ { paddingBottom: "5px" } }
                                        >
                                            <DeathSave
                                                classes="d-and-d-save-success"
                                                label="Successes"
                                                name="deathsaveSuccesses"
                                                value={ character.deathSaves?.successes ?? 0 }
                                                onChange={ (_name, successes) => {
                                                    const deathSaves = character.deathSaves ?? { successes: 0, failures: 0, isStabilized: false };
                                                    updateCharacter("deathSaves", { ...deathSaves, successes: successes });
                                                } }
                                            />
                                            <DeathSave
                                                classes="d-and-d-save-failure"
                                                label="Failures"
                                                name="deathsaveFailures"
                                                value={ character.deathSaves?.failures ?? 0 }
                                                onChange={ (_name, failures) => {
                                                    const deathSaves = character.deathSaves ?? { successes: 0, failures: 0, isStabilized: false };
                                                    updateCharacter("deathSaves", { ...deathSaves, failures: failures });
                                                } }
                                            />
                                            <label
                                                className="d-and-d-title"
                                                style={ { marginTop: "6px" } }
                                            >
                                                Death Saves
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-and-d-box gray grow flex flex-col ">
                                <div
                                    className="d-and-d-box white flex flex-col flex-1"
                                    style={ {
                                        borderRadius: "8px 8px 0 0",
                                        marginBottom: "5px",
                                        paddingTop: "1px",
                                        paddingBottom: "5px",
                                    } }
                                >
                                    <textarea
                                        defaultValue={
                                            character.personalityTraits
                                                ? character.personalityTraits
                                                : ""
                                        }
                                        className="grow"
                                    />
                                    <label className="d-and-d-title">Personality Traits</label>
                                </div>
                                <div
                                    className="d-and-d-box white flex flex-col flex-1"
                                    style={ {
                                        borderRadius: "0 0 0 0",
                                        marginBottom: "5px",
                                        paddingTop: "1px",
                                        paddingBottom: "5px",
                                    } }
                                >
                                    <textarea
                                        defaultValue={ character.ideals ? character.ideals : "" }
                                        className="grow"
                                    />
                                    <label className="d-and-d-title">Ideals</label>
                                </div>
                                <div
                                    className="d-and-d-box white flex flex-col flex-1"
                                    style={ {
                                        borderRadius: "0 0 0 0",
                                        marginBottom: "5px",
                                        paddingTop: "1px",
                                        paddingBottom: "5px",
                                    } }
                                >
                                    <textarea
                                        defaultValue={ character.bonds ? character.bonds : "" }
                                        className="grow"
                                    />
                                    <label className="d-and-d-title">Bonds</label>
                                </div>
                                <div
                                    className="d-and-d-box white flex flex-col flex-1"
                                    style={ {
                                        borderRadius: "0 0 8px 8px",
                                        marginBottom: "0px",
                                        paddingTop: "1px",
                                        paddingBottom: "4px",
                                    } }
                                >
                                    <textarea
                                        defaultValue={ character.flaws ? character.flaws : "" }
                                        className="grow"
                                    />
                                    <label className="d-and-d-title">Flaws</label>
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <MainBox />
                        </div>
                    </div>

                </div>
                <div>
                    { focusItem && <FocusCol /> }
                </div>
            </div>



        </div>
    );
}
