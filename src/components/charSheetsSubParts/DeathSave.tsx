import React from "react";

function DeathSave(props: {
	classes?: string;
	label: React.ReactNode;
	value?: number;
	onChange: (name: string, value: number) => void;
	name: string;
}) {
	const count = Math.min(3, Math.max(0, props.value ?? 0));
	const classes = "d-and-d-deathsave" + (props.classes ? " " + props.classes : "");

	const set = (v: number) => props.onChange(props.name, v);

	return (
		<div className={classes}>
			<label>{props.label}</label>
			<br />
			<div style={{ display: "inline-block" }}>
				<div
					className={count >= 1 ? "d-and-d-skill-circle active" : "d-and-d-skill-circle"}
					onClick={() => set(count >= 1 ? 0 : 1)}
					role="button"
					aria-pressed={count >= 1}
					tabIndex={0}
					onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(count >= 1 ? 0 : 1); } }}
				/>
				=
				<div
					className={count >= 2 ? "d-and-d-skill-circle active" : "d-and-d-skill-circle"}
					onClick={() => set(count >= 2 ? 1 : 2)}
					role="button"
					aria-pressed={count >= 2}
					tabIndex={0}
					onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(count >= 2 ? 1 : 2); } }}
				/>
				=
				<div
					className={count >= 3 ? "d-and-d-skill-circle active" : "d-and-d-skill-circle"}
					onClick={() => set(count >= 3 ? 2 : 3)}
					role="button"
					aria-pressed={count >= 3}
					tabIndex={0}
					onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); set(count >= 3 ? 2 : 3); } }}
				/>
			</div>
		</div>
	);
}

export default DeathSave;
