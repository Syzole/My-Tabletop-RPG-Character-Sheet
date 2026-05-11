import React from "react";
import type { Skill } from "@/types/skills";
import type { SavingThrowProficiencyLevel } from "@/types/savingThrows";

type SkillProps = {
	className?: string;
	label: string;
	defaultValue?: string | number | null;
	hint?: string;
	targetSkill: Skill | SavingThrowProficiencyLevel;
}

export default function Skill({ className, label, defaultValue, hint, targetSkill }: SkillProps) {
	let classes = "d-and-d-skill";
	if (className) {
		classes += " " + className;
	}

	//first check if targetSkill is skill or SavingThrowProficiencyLevel
	const isSkill = (targetSkill as Skill).stat !== undefined;
	if (isSkill) {
		const skill = targetSkill as Skill;
		return (
			<div className={ classes }>
				<div
					className={
						skill.proficient === "expertise"
							? "d-and-d-skill-circle expertise"
							: skill.proficient === "proficient"
								? "d-and-d-skill-circle active"
								: skill.proficient === "halfProficient"
									? "d-and-d-skill-circle half"
									: "d-and-d-skill-circle"
					}
				/>
				<input
					type="text"
					value={ defaultValue !== undefined && defaultValue !== null ? defaultValue : "" }
					readOnly
				/>
				<label>{ label }</label>
				{ hint ? <span className="d-and-d-skill-hint">{ hint }</span> : null }
			</div>
		);
	} else {
		const savingThrow = targetSkill as SavingThrowProficiencyLevel;
		return (
			<div className={ classes }>
				<div className={ savingThrow === "proficient" ? "d-and-d-skill-circle active" : "d-and-d-skill-circle" } />
				<input
					type="text"
					value={ defaultValue !== undefined && defaultValue !== null ? defaultValue : "" }
					readOnly
				/>
				<label>{ label }</label>
				{ hint ? <span className="d-and-d-skill-hint">{ hint }</span> : null }
			</div>
		);
	}
}
