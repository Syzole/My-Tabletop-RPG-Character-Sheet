import React from "react";

function StatBox(props: { classes?: string; defaultValue: string | number | readonly string[] | undefined; label: React.ReactNode; readonly hint?: React.ReactNode; name: any }) {
	let classes = "d-and-d-statbox";
	if (props.classes) {
		classes += " " + props.classes;
	}

	let modifier: string = "";
	if (props.defaultValue && !isNaN(Number(props.defaultValue))) {
		const modifierNum = Math.floor((Number(props.defaultValue) - 10) / 2);
		if (modifierNum > 0) {
			modifier = "+" + modifierNum;
		} else {
			modifier = modifierNum.toString();
		}
	}

	return (
		<div>
			<div className={classes}>
				<label>{props.label}</label>
				<div className="d-and-d-statbox-modifier">{modifier}</div>
			</div>
			<div className="d-and-d-statbox-value">
				<input
					type="text"
					defaultValue={props.defaultValue ? props.defaultValue : ""}
					readOnly // Added the readOnly attribute
				/>
			</div>
		</div>
	);
}

export default StatBox;
