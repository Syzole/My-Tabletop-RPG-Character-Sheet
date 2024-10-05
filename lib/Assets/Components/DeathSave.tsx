import React from 'react';

function DeathSave(props: { classes?: string; label: React.ReactNode; defaultValue?: number; onChange: (name: any, value: number | null) => void; name: any }) {
	let classes = "d-and-d-deathsave";
	if (props.classes) {
		classes += " " + props.classes;
	}

	return (
		<div className={ classes }>
			<label>{ props.label }</label>
			<br />
			<div style={ { display: "inline-block" } }>
				<div
					className={ props.defaultValue && props.defaultValue >= 1 ? "d-and-d-skill-circle active" : "d-and-d-skill-circle" }
					onClick={ () => {
						props.onChange(props.name, props.defaultValue === 1 ? null : 1);
					} }
				/>
				=
				<div
					className={ props.defaultValue && props.defaultValue >= 2 ? "d-and-d-skill-circle active" : "d-and-d-skill-circle" }
					onClick={ () => {
						props.onChange(props.name, props.defaultValue === 2 ? null : 2);
					} }
				/>
				=
				<div
					className={ props.defaultValue && props.defaultValue >= 3 ? "d-and-d-skill-circle active" : "d-and-d-skill-circle" }
					onClick={ () => {
						props.onChange(props.name, props.defaultValue === 3 ? null : 3);
					} }
				/>
			</div>
		</div>
	);
}

export default DeathSave;
