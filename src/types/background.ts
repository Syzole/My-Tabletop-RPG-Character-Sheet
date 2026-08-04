import { SkillName } from "@/types/skills";
import { Feature } from "@/types/feature";
import { ChoiceItem, ChoiceOption } from "./class";

//a background has a name, 2 prof skills, sometimes a language sometimes a tool and sometimes gold
// they also have equipment, but that can be swapped for gold

//some times they get feats as well in the newer versions of the game
export interface Background {
	name: string;
	source: string;
	proficiencies: {
		skills: SkillName[];
		languages: Map<string, number>;
		tools: Set<string>;
	};
	gold: number;

	startingItems: {
		automatic: Record<string, ChoiceItem>;
		choices: Array<{
			choose: number;
			from: Record<string, ChoiceOption>;
		}>;
	};
	feat?: Feature;
}
