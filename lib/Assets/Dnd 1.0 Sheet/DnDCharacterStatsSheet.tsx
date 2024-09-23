"use client";
import React from "react";

// eslint-disable-next-line no-unused-vars
import DnDCharacter from "@/lib/DnDCharacter";

import CharacterBox from "../Components/CharecterBox";
import DeathSave from "../Components/DeathSave";
import Skill from "../Components/Skill";
import Statbox from "../Components/StatBox";
import StatBox2 from "../Components/StatBox2";
import StatRow from "../Components/StatRow";


// below is the import for the DnDCharacter class
import { allSkills } from "@/lib/definitions";
import { Proficiencies } from "@/lib/types";

import "./dndstyles.css";


interface IDnDCharacterStatsSheetProps {
	character?: DnDCharacter;
	defaultCharacter?: DnDCharacter;
	onCharacterChanged?: (character: DnDCharacter, changedField: string, newdefaultValue: any) => void;
}

interface IDnDCharacterStatsSheetState {
	character: DnDCharacter;
}

const initialState: IDnDCharacterStatsSheetState = {
	character: new DnDCharacter(),
};

export default class DnDCharacterStatsSheet extends React.Component<IDnDCharacterStatsSheetProps, IDnDCharacterStatsSheetState> {
	constructor(props: IDnDCharacterStatsSheetProps) {
		super(props);

		// Initialize the state based on the defaultCharacter prop if provided
		this.state = {
			character: props.defaultCharacter ? new DnDCharacter() : new DnDCharacter(),
		};

		// If a default character is provided, assign its properties to the new DnDCharacter instance
		if (props.defaultCharacter) {
			Object.assign(this.state.character, props.defaultCharacter);
		}
	}


	// Update character in the local state
	updateCharacter(name: string, defaultValue: any) {
		const oldCharacter = this.getCharacter();

		// Create a new instance of DnDCharacter and assign properties from the old character
		const newCharacter: DnDCharacter = new DnDCharacter();
		Object.assign(newCharacter, oldCharacter);  // This preserves methods

		// Update the specific field that was changed
		newCharacter[ name ] = defaultValue;

		console.log(`Updating ${name} to ${defaultValue}`);

		// If uncontrolled, update the local state
		if (!this.props.character) {
			console.log("Component is uncontrolled, updating state.");
			this.setState({ character: newCharacter }, () => {
				console.log(`${name} is now`, this.state.character[ name ]);
			});
		}

		// If controlled, call parent's callback
		if (typeof this.props.onCharacterChanged === "function") {
			this.props.onCharacterChanged(newCharacter, name, defaultValue);
			console.log("Calling onCharacterChanged");
		}
	}

	refreshCharecterSheet() {
		const oldCharacter = this.getCharacter();

		// Create a new instance of DnDCharacter and assign properties from the old character
		const newCharacter: DnDCharacter = new DnDCharacter();
		Object.assign(newCharacter, oldCharacter);  // This preserves methods

		// If uncontrolled, update the local state
		if (!this.props.character) {
			console.log("Component is uncontrolled, updating state.");
			this.setState({ character: newCharacter });
		}

		// If controlled, call parent's callback
		if (typeof this.props.onCharacterChanged === "function") {
			this.props.onCharacterChanged(newCharacter, "", "");
			console.log("Calling onCharacterChanged");
		}
	}


	// Get character: use props.character if controlled, otherwise use local state
	getCharacter(): DnDCharacter {
		return this.props.character || this.state.character;
	}

	// Format proficiencies function
	formatProficiencies = (proficiencies: Proficiencies) => {
		if (!proficiencies) return "";

		// Check if proficiencies are in the right format
		if (!proficiencies.armor || !proficiencies.weapons || !proficiencies.tools || !proficiencies.languages) {
			return proficiencies;
		}

		// Convert proficiency object to a readable string
		return [
			"Armor: " + (proficiencies.armor.length > 0 ? proficiencies.armor.join(", ") : "None"),
			"Weapons: " + (proficiencies.weapons.length > 0 ? proficiencies.weapons.join(", ") : "None"),
			"Tools: " + (proficiencies.tools.length > 0 ? proficiencies.tools.join(", ") : "None"),
			"Languages: " + (proficiencies.languages.length > 0 ? proficiencies.languages.join(", ") : "None"),
		].join("\n");
	};

	// Render method to display character sheet
	render() {
		let character = this.getCharacter();

		if (character.deathsaveFailures === 3) {
			return (
				<div className="text-center justify-center">
					<div className="font-extrabold text-9xl">You're dead lmao</div>
					<button className="btn btn-primary btn-wide" onClick={ () => {
						character.deathsaveSuccesses = 0;
						character.hp = "1";
						character.deathsaveFailures = 0;
						this.refreshCharecterSheet();
					}
					}>Revive</button>
				</div>
			);
		}

		return (
			<div className="d-and-d-character-sheet container-xl mt-5 mb-5 flex flex-col justify-center items-center">
				<div className="row mb-4 flex justify-center items-center">
					<div className="col-md-3 pr-2 pl-2">
						<div className="d-and-d-page-title">D&D</div>
						<div className="d-and-d-attribute-collection char-name pr-3 pl-3">
							<input
								type="text"
								defaultValue={ character.name ? character.name : "" }
								onChange={ (e) => this.updateCharacter("name", e.target.value) }
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
										defaultValue={ character.classLevel ? character.classLevel : "" }
										onChange={ (e) => this.updateCharacter("classLevel", e.target.value) }
									/>
									<label>Class & Level</label>
								</div>
								<div className="col-md-3 col-6 pl-0 pr-0">
									<input
										type="text"
										defaultValue={ character.background ? character.background : "" }
										onChange={ (e) => this.updateCharacter("background", e.target.value) }
									/>
									<label>Background</label>
								</div>
								<div className="col-md-3 col-6 pl-0 pr-0">
									<input
										type="text"
										defaultValue={ character.playerName ? character.playerName : "" }
										onChange={ (e) => this.updateCharacter("playerName", e.target.value) }
									/>
									<label>Player Name</label>
								</div>
								<div className="col-md-3 col-6 pl-0 pr-0">
									<input
										type="text"
										defaultValue={ character.faction ? character.faction : "" }
										onChange={ (e) => this.updateCharacter("faction", e.target.value) }
									/>
									<label>Faction</label>
								</div>
							</div>
							<div className="row pl-3 pr-3 flex">
								<div className="col-md-3 col-6 pl-0 pr-0 w-72">
									<input
										type="text"
										defaultValue={ character.race ? character.race : "" }
										onChange={ (e) => this.updateCharacter("race", e.target.value) }
									/>
									<label>Race</label>
								</div>
								<div className="col-md-3 col-6 pl-0 pr-0">
									<input
										type="text"
										defaultValue={ character.alignment ? character.alignment : "" }
										onChange={ (e) => this.updateCharacter("alignment", e.target.value) }
									/>
									<label>Alignment</label>
								</div>
								<div className="col-md-3 col-6 pl-0 pr-0">
									<input
										type="text"
										defaultValue={ character.xp ? character.xp : "" }
										onChange={ (e) => this.updateCharacter("xp", e.target.value) }
									/>
									<label>Experience Points</label>
								</div>
								<div className="col-md-3 col-6 pl-0 pr-0">
									<input
										type="text"
										defaultValue={ character.dciNo ? character.dciNo : "" }
										onChange={ (e) => this.updateCharacter("dciNo", e.target.value) }
									/>
									<label>DCI Number</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row flex justify-center">
					<div className="col-md-4 pr-4 flex flex-col">
						<div className="row flex justify-center items-center">
							<div className="col-4 pr-6">
								<div className="d-and-d-box gray">
									<Statbox
										label="Strength"
										name="str"
										defaultValue={ character.baseStats.str }
									/>
									<Statbox
										label="Dexterity"
										name="dex"
										defaultValue={ character.baseStats.dex }
									/>
									<Statbox
										label="Constitution"
										name="con"
										defaultValue={ character.baseStats.con }
									/>
									<Statbox
										label="Intelligence"
										name="int"
										defaultValue={ character.baseStats.int }
									/>
									<Statbox
										label="Wisdom"
										name="wis"
										defaultValue={ character.baseStats.wis }
									/>
									<Statbox
										label="Charisma"
										name="cha"
										defaultValue={ character.baseStats.cha }
									/>
								</div>
							</div>
							<div className="col-8 flex flex-col justify-between">
								<StatRow
									label="Inspiration"
									name="inspiration"
									defaultValue={ character.inspiration }
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
											name="strSave"
											defaultValue={ character.calculateSavingThrowModifier("str") }
											checked={ character.savingThrowProficiencies.str === "Proficient" }
										/>
										<Skill
											label="Dexterity"
											name="dexSave"
											defaultValue={ character.calculateSavingThrowModifier("dex") }
											checked={ character.savingThrowProficiencies.dex === "Proficient" }
										/>
										<Skill
											label="Constitution"
											name="conSave"
											defaultValue={ character.calculateSavingThrowModifier("con") }
											checked={ character.savingThrowProficiencies.con === "Proficient" }
										/>
										<Skill
											label="Intelligence"
											name="intSave"
											defaultValue={ character.calculateSavingThrowModifier("int") }
											checked={ character.savingThrowProficiencies.int === "Proficient" }
										/>
										<Skill
											label="Wisdom"
											name="wisSave"
											defaultValue={ character.calculateSavingThrowModifier("wis") }
											checked={ character.savingThrowProficiencies.wis === "Proficient" }
										/>
										<Skill
											label="Charisma"
											name="chaSave"
											defaultValue={ character.calculateSavingThrowModifier("cha") }
											checked={ character.savingThrowProficiencies.cha === "Proficient" }
										/>
									</div>
									<label
										className="d-and-d-title"
										style={ { marginTop: "10px" } }
									>
										Saving Throws
									</label>
								</div>
								<div className="d-and-d-box ">
									<div style={ { textAlign: "left" } }>
										{ Array.from(allSkills.entries()).map(([ label, name ]) => (
											<Skill
												key={ name } // Ensure a unique key prop for each Skill component
												label={ label } // Display name of the skill
												name={ name } // Internal identifier for the skill
												defaultValue={ character.calculateSkillModifier(name) } // Skill modifier
												checked={ character.skills[ name ].proficient === "Proficient" || character.skills[ name ].proficient === "Expertise" } // Proficiency check
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
								defaultValue={ character.calculateSkillModifier("perception") + 10 }
							/>
						</div>
						<div className="d-and-d-box mt-4 flex flex-col grow">
							<textarea
								defaultValue={ character ? (this.formatProficiencies(character.proficiencies) as string) : "" }
								rows={ 12 }
								className="flex-grow"
							/>
							<label
								className="d-and-d-title"
								style={ { marginTop: "10px" } }
							>
								Other Proficiencies & Languages
							</label>
						</div>
					</div>
					<div className="flex flex-col w-3/5">
						<div className="flex">
							<div className="d-and-d-box gray w-3/4 mr-5">
								<div className="row flex">
									<div className="col-4 pr-2">
										<StatBox2
											classes="shield"
											labelTop="Armour"
											label="Class"
											name="ac"
											defaultValue={ character.calculateAC() }
										/>
									</div>
									<div className="col-4 pr-2 pl-2">
										<StatBox2
											label="Initiative"
											name="init"
											defaultValue={ "+" + character.initiative }
										/>
									</div>
									<div className="col-4 pl-2">
										<StatBox2
											label="Speed"
											name="speed"
											defaultValue={ character.speed }
										/>
									</div>
								</div>

								<div
									className="d-and-d-box white flex flex-col"
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
											defaultValue={ character.maxHp ? character.maxHp : "" }
											onChange={ (e) => this.updateCharacter("maxHp", e.target.value) }
										/>
									</div>
									<input
										type="number"
										className="d-and-d-cinput"
										defaultValue={ character.hp ? character.hp : "" }
										onChange={ (e) => {
											this.updateCharacter("hp", e.target.value);
										} }
									/>
									<label
										className="d-and-d-title"
										style={ { marginTop: "5px" } }
									>
										Current Hit Points
									</label>
								</div>
								<div
									className="d-and-d-box white mb-2 flex flex-col"
									style={ { borderRadius: "0 0 8px 8px", paddingBottom: "5px" } }
								>
									<input
										type="number"
										className="d-and-d-cinput"
										defaultValue={ character.tempHp ? character.tempHp : "" }
										onChange={ (e) => this.updateCharacter("tempHp", e.target.value) }
									/>
									<label
										className="d-and-d-title"
										style={ { marginTop: "5px" } }
									>
										Temporary Hit Points
									</label>
								</div>

								<div className="row mt-1 flex">
									<div className="col-6 pr-1">
										<div
											className="d-and-d-box white mb-0"
											style={ { paddingBottom: "5px" } }
										>
											<div className="d-and-d-gray-text">
												<label style={ { width: "25px" } }>Total</label>
												<input
													type="text"
													style={ { width: "calc(100% - 25px)" } }
													className="d-and-d-linput"
													defaultValue={ character.hitDiceMax ? character.hitDiceMax : "" }
													onChange={ (e) => this.updateCharacter("hitDiceMax", e.target.value) }
												/>
											</div>
											<input
												type="text"
												className="d-and-d-cinput"
												defaultValue={ character.hitDice ? character.hitDice : "" }
												onChange={ (e) => this.updateCharacter("hitDice", e.target.value) }
											/>
											<label
												className="d-and-d-title"
												style={ { marginTop: "5px" } }
											>
												Hit Dice
											</label>
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
												defaultValue={ character.deathsaveSuccesses }
												onChange={ (name: string, defaultValue: any) => {
													this.updateCharacter(name, defaultValue);
												} }
											/>
											<DeathSave
												classes="d-and-d-save-failure"
												label="Failures"
												name="deathsaveFailures"
												defaultValue={ character.deathsaveFailures }
												onChange={ (name: string, defaultValue: any) => {
													this.updateCharacter(name, defaultValue);
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
							<div
								className="d-and-d-box gray w-1/4"
								style={ { marginBottom: "17px" } }
							>
								<div
									className="d-and-d-box white"
									style={ {
										borderRadius: "8px 8px 0 0",
										marginBottom: "5px",
										paddingTop: "1px",
										paddingBottom: "5px",
									} }
								>
									<textarea
										defaultValue={ character.personalityTraits ? character.personalityTraits : "" }
										onChange={ (e) => this.updateCharacter("personalityTraits", e.target.value) }
										rows={ 3 }
									/>
									<label className="d-and-d-title">Personality Traits</label>
								</div>
								<div
									className="d-and-d-box white"
									style={ {
										borderRadius: "0 0 0 0",
										marginBottom: "5px",
										paddingTop: "1px",
										paddingBottom: "5px",
									} }
								>
									<textarea
										defaultValue={ character.ideals ? character.ideals : "" }
										onChange={ (e) => this.updateCharacter("ideals", e.target.value) }
										rows={ 3 }
									/>
									<label className="d-and-d-title">Ideals</label>
								</div>
								<div
									className="d-and-d-box white"
									style={ {
										borderRadius: "0 0 0 0",
										marginBottom: "5px",
										paddingTop: "1px",
										paddingBottom: "5px",
									} }
								>
									<textarea
										defaultValue={ character.bonds ? character.bonds : "" }
										onChange={ (e) => this.updateCharacter("bonds", e.target.value) }
										rows={ 2 }
									/>
									<label className="d-and-d-title">Bonds</label>
								</div>
								<div
									className="d-and-d-box white"
									style={ {
										borderRadius: "0 0 8px 8px",
										marginBottom: "0px",
										paddingTop: "1px",
										paddingBottom: "4px",
									} }
								>
									<textarea
										defaultValue={ character.flaws ? character.flaws : "" }
										onChange={ (e) => this.updateCharacter("flaws", e.target.value) }
										rows={ 2 }
									/>
									<label className="d-and-d-title">Flaws</label>
								</div>
							</div>
						</div>
						<div className="d-and-d-box gray grow">
							<CharacterBox charecter={ character } />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

