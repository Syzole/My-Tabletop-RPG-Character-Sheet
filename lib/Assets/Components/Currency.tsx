import React from "react";

function Currency(props: { classes?: string; label: React.ReactNode; defaultValue: string | number | readonly string[] | undefined; onChange: (arg0: any, arg1: string) => void; name: any }) {
	let classes = "d-and-d-currency grow gap-1";
	if (props.classes) {
		classes += " " + props.classes;
	}

	return (
		<div className={classes}>
			<div className="d-and-d-currency-label">
				<label>{props.label}</label>
			</div>
			<div className="d-and-d-currency-value">
				<input
					type="text"
					value={props.defaultValue ? props.defaultValue : ""}
					onChange={(e) => props.onChange(props.name, e.target.value)}
				/>
			</div>
		</div>
	);
}

export default Currency;
