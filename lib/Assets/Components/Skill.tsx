import React from "react";

function Skill(props: { classes?: string; checked?: boolean; name: string; defaultValue: string | number | readonly string[] | undefined; label?: React.ReactNode; hint?: React.ReactNode }) {
	let classes = "d-and-d-skill";
	if (props.classes) {
		classes += " " + props.classes;
	}

	return (
		<div className={classes}>
			<div className={props.checked ? "d-and-d-skill-circle active" : "d-and-d-skill-circle"} />
			<input
				type="text"
				value={props.defaultValue !== undefined && props.defaultValue !== null ? props.defaultValue : ""}
				readOnly
			/>
			<label>{props.label}</label>
			{props.hint ? <span className="d-and-d-skill-hint">{props.hint}</span> : null}
		</div>
	);
}

export default Skill;
