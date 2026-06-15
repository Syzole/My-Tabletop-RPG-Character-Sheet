import { Skill, Skills } from "./skills";

//a background has a name, 2 prof skills, sometimes a language sometimes a tool and sometimes gold
// they also have equipment, but that can be swapped for gold

export interface Background {
    name: string;
    source: string;
    proficiencies: {
        skills: Skill[];
        languages: Map<string, number>;
        tools: Set<string>;
    } ,
    gold: number;
}