import DnDCharacter from "../DnDCharacter";
import { defaultSkill, Feature, Item, ProficiencyLevel, SavingThrowProficiencies, SavingThrowProficiencyLevel, skills, Stats } from "../types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the structure of the JSON data
interface CharacterJsonData {
    name: string;
    proficiency: string[];
    startingProficiencies: {
        armor: string[];
        weapons: string[];
        tools: string[];
        skills: Array<{ choose: { from: string[]; count: number } }>;
    };
    startingEquipment: {
        default: string[];
    };
    classFeatures: Array<string | { classFeature: string; gainSubclassFeature: boolean }>;
    hd: { faces: number };
}

/**
 * Initialize a level 1 Rogue DnDCharacter based on JSON data.
 */
async function unpackRogueLevelOne(jsonData: CharacterJsonData): Promise<DnDCharacter> {
    const baseStats: Stats = { str: 8, dex: 15, con: 14, int: 10, wis: 13, cha: 12 };
    const character = new DnDCharacter(baseStats);

    // Set basic properties
    character.name = "Jhon Doe"; //manually set the name
    character.classLevel = "Rogue 1";
    character.hitDice = jsonData.hd.faces.toString();
    character.proficiencyBonus = 2; // Standard for level 1

    // Assign saving throw proficiencies
    character.savingThrowProficiencies = setSavingThrows(jsonData.proficiency);

    let { skills, ...otherProficiencies } = jsonData.startingProficiencies;

    let formattedStartingProficiencies = reformatStartingProficiencies(otherProficiencies);

    // Set character proficiencies
    character.proficiencies = {
        armor: formattedStartingProficiencies.armor,
        weapons: formattedStartingProficiencies.weapons,
        tools: formattedStartingProficiencies.tools,
        languages: formattedStartingProficiencies.languages,
    };

    // Choose skills based on the JSON data
    character.skills = chooseSkills(jsonData.startingProficiencies.skills, 4);

    // Parse and assign starting equipment
    character.inventory = await parseEquipmentList(jsonData.startingEquipment.default);

    // Set class features for level 1 Rogue
    const levelOneFeatures = jsonData.classFeatures.slice(0, 3); // Level 1 typically has 3 features
    character.features = Object.fromEntries(levelOneFeatures.map((feature, index) => [ parseFeature(feature).feature_name, parseFeature(feature) ]));

    return character;
}

/**
 * Set saving throw proficiencies for the character.
 */
function setSavingThrows(proficiencies: string[]): SavingThrowProficiencies {
    const savingThrows: SavingThrowProficiencies = {
        str: SavingThrowProficiencyLevel.None,
        dex: SavingThrowProficiencyLevel.None,
        con: SavingThrowProficiencyLevel.None,
        int: SavingThrowProficiencyLevel.None,
        wis: SavingThrowProficiencyLevel.None,
        cha: SavingThrowProficiencyLevel.None,
    };
    proficiencies.forEach(prof => {
        if (prof in savingThrows) {
            savingThrows[ prof as keyof SavingThrowProficiencies ] = SavingThrowProficiencyLevel.Proficient;
        }
    });
    return savingThrows;
}

/**
 * Choose skills based on JSON skill choices and count.
 */
function chooseSkills(skillChoices: { choose: { from: string[]; count: number } }[], count: number): skills {
    const selectedSkills: skills = {
        acrobatics: defaultSkill("acrobatics"),
        animalHandling: defaultSkill("animalHandling"),
        arcana: defaultSkill("arcana"),
        athletics: defaultSkill("athletics"),
        deception: defaultSkill("deception"),
        history: defaultSkill("history"),
        insight: defaultSkill("insight"),
        intimidation: defaultSkill("intimidation"),
        investigation: defaultSkill("investigation"),
        medicine: defaultSkill("medicine"),
        nature: defaultSkill("nature"),
        perception: defaultSkill("perception"),
        performance: defaultSkill("performance"),
        persuasion: defaultSkill("persuasion"),
        religion: defaultSkill("religion"),
        sleightOfHand: defaultSkill("sleightOfHand"),
        stealth: defaultSkill("stealth"),
        survival: defaultSkill("survival"),
    };

    skillChoices[ 0 ].choose.from.slice(0, count).forEach(skill => {
        if (skill in selectedSkills) {
            selectedSkills[ skill as keyof skills ].proficient = ProficiencyLevel.Proficient;
        }
    });

    return selectedSkills;
}

/**
 * Parse equipment choices from the JSON data.
 */
function parseEquipment(equipmentList: any[]): { [ key: string ]: Item } {
    const equipmentObj: { [ key: string ]: Item } = {};

    equipmentList.forEach(equipment => {
        equipmentObj[ equipment.name ] = equipment;
    });

    return equipmentObj;
}

/**
 * Parse features from the JSON classFeatures.
 */
function parseFeature(feature: string | { classFeature: string; gainSubclassFeature: boolean }): Feature {
    if (typeof feature === "string") {
        return { feature_name: feature, source_name: "Rogue", description: "", type: "Passive" };
    } else {
        return {
            feature_name: feature.classFeature,
            source_name: "Rogue",
            description: feature.gainSubclassFeature ? "Subclass feature gained" : "",
            type: "Passive"
        };
    }
}

async function getItemFromDatabase(itemName: string): Promise<Item | null> {
    const item = await prisma.item.findFirst({
        where: {
            name: {
                contains: itemName,
                mode: 'insensitive'
            }
        }
    });
    return item ? {
        ...item,
        quantity: 1,
        value: item.value ?? undefined,
        weight: item.weight ?? undefined,
        properties: item.properties ? (typeof item.properties === 'object' ? item.properties : {}) : {}
    } : null;
}

async function parseEquipmentList(equipmentList: string[]): Promise<{ [ key: string ]: Item }> {
    const equipmentObj: { [ key: string ]: Item } = {};

    for (const equipment of equipmentList) {
        const matches = equipment.match(/{@item ([^|]+)/g);
        if (matches) {
            for (const match of matches) {
                const itemName = match.replace('{@item ', '').trim();
                const item = await getItemFromDatabase(itemName);
                if (item) {
                    equipmentObj[ item.name ] = item;
                }
            }
        }
    }

    return equipmentObj;
}

/**
 *  use Regex to to reformat the startingProficiencies
 */
function reformatStartingProficiencies(startingProficiencies: { [ key: string ]: any }): { [ key: string ]: string[] } {
    let reformattedProficiencies: { [ key: string ]: string[] } = {
        armor: [],
        weapons: [],
        tools: [],
        languages: []
    };

    for (let key in startingProficiencies) {
        const values = startingProficiencies[ key ];
        if (!Array.isArray(values)) continue;

        reformattedProficiencies[ key ] = values.map((val: any) => {
            //console.log(val);
            if (typeof val === 'string') {
                // Handle simple strings like 'light' -> 'Light armor'
                if (key === 'armor') {
                    return val.charAt(0).toUpperCase() + val.slice(1) + ' armor';
                }
                // Handle item strings like '{@item hand crossbow|phb|hand crossbows}'
                const match = val.match(/{@item ([^|]+)/);
                if (match) {
                    const itemName = match[ 1 ].replace(/_/g, ' ');
                    return itemName.split(' ').map(word =>
                        word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ');
                }
                if (val === "simple" || val === "martial") {
                    return val.charAt(0).toUpperCase() + val.slice(1) + ' weapons';
                }
                return val;
            } else if (typeof val === 'object') {
                // Handle tool proficiencies objects
                return Object.keys(val).map(tool => {
                    const match = tool.match(/{@item ([^|]+)/);
                    if (match) {
                        return match[ 1 ].charAt(0).toUpperCase() + match[ 1 ].slice(1);
                    }
                    return tool;
                });
            }
            return val;
        }).flat();

        //remove toolProficiencies from the reformattedProficiencies
        if (key === 'toolProficiencies') {
            delete reformattedProficiencies[ key ];
        }

    }

    return reformattedProficiencies;
}

export default unpackRogueLevelOne;
